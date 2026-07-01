// ═══════════════════════════════════════════════════════
// Water Love - Cloudflare Worker
// Κρατάει το GitHub token κρυφό. Διαβάζει (action:'read') και γράφει (add/replace/
// delete) στα αρχεία δεδομένων (products-data.json, gallery-data.json,
// inquiries-data.json) ανάλογα με το
// πεδίο target. Το read περνάει από το GitHub API, ώστε να είναι πάντα φρέσκο.
//
// SETUP:
//   1. Cloudflare → Workers → Create → paste this code
//   2. Settings → Variables and Secrets → Add secret:
//        Name:  GITHUB_TOKEN
//        Value: ghp_... (το GitHub Personal Access Token σου, repo scope)
//   3. Deploy
//
// Αν αλλάξεις repo, ενημέρωσε τα GITHUB_OWNER / GITHUB_REPO παρακάτω.
// ═══════════════════════════════════════════════════════

const GITHUB_OWNER = 'waterlovethessaloniki';
const GITHUB_REPO = 'WaterLove-';
const GITHUB_BRANCH = 'main';

// Επιτρεπόμενα αρχεία που μπορεί να γράψει το Worker
const ALLOWED_FILES = {
  gallery: 'gallery-data.json',
  products: 'products-data.json',
  inquiries: 'inquiries-data.json',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const token = env.GITHUB_TOKEN;
    if (!token) {
      return json({ error: 'Server not configured' }, 500);
    }

    // Route strictly by target. An unknown or missing target is rejected loudly
    // (400) instead of silently falling back to a file, so a future misroute can
    // never quietly write to the wrong place.
    const target = body.target;
    const GITHUB_FILE = ALLOWED_FILES[target];
    if (!GITHUB_FILE) {
      return json({ error: 'Unknown target', detail: `target must be one of: ${Object.keys(ALLOWED_FILES).join(', ')}` }, 400);
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
    const ghHeaders = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'WaterLove-Worker',
      'Content-Type': 'application/json',
    };

    const action = body.action || 'replace';

    // READ: return the file contents fresh from the GitHub Contents API. This
    // bypasses raw.githubusercontent.com, whose CDN ignores cache-busting query
    // params and serves stale data for up to ~5 minutes after a write.
    if (action === 'read') {
      try {
        const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders, cf: { cacheTtl: 0 } });
        if (getRes.status === 404) return json({ success: true, data: [] });
        if (!getRes.ok) return json({ error: 'GitHub read failed', detail: `status ${getRes.status}` }, 502);
        const fileInfo = await getRes.json();
        const decoded = atob(fileInfo.content.replace(/\n/g, ''));
        const data = JSON.parse(new TextDecoder().decode(
          Uint8Array.from(decoded, c => c.charCodeAt(0))
        ));
        return json({ success: true, data: Array.isArray(data) ? data : [] });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    try {
      // 1. Read current file (SHA + existing data)
      let sha = null;
      let currentData = [];
      const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
        const decoded = atob(fileInfo.content.replace(/\n/g, ''));
        currentData = JSON.parse(new TextDecoder().decode(
          Uint8Array.from(decoded, c => c.charCodeAt(0))
        ));
      }

      // 2. Apply action
      if (action === 'replace') {
        currentData = body.data;
      } else if (action === 'add') {
        currentData.push(body.item);
      } else if (action === 'delete') {
        currentData = currentData.filter(x => x.id !== body.id);
      } else {
        return json({ error: 'Unknown action' }, 400);
      }

      // 3. Write back
      const newContent = btoa(unescape(encodeURIComponent(
        JSON.stringify(currentData, null, 2)
      )));
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: ghHeaders,
        body: JSON.stringify({
          message: `Update ${target} (${action}) - ${new Date().toISOString()}`,
          content: newContent,
          sha: sha,
          branch: GITHUB_BRANCH,
        }),
      });
      if (!putRes.ok) {
        const err = await putRes.json();
        return json({ error: 'GitHub write failed', detail: err.message }, 500);
      }

      return json({ success: true, count: currentData.length });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
