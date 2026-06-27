# Water Love — Website

Ιστοσελίδα για το κατάστημα ενυδρείων **Water Love** (Λαμπρινή Μπιζίκη, Θεσσαλονίκη).

## Αρχεία

| Αρχείο | Τι κάνει |
|--------|----------|
| `index.html` | Το κύριο website (5 σελίδες: Αρχική, Σχετικά, Προϊόντα, FAQ, Επικοινωνία) |
| `admin.html` | Πίνακας διαχείρισης — ανέβασμα/επεξεργασία/διαγραφή φωτογραφιών gallery |
| `gallery-data.json` | Η "βάση δεδομένων" της gallery (ξεκινά άδεια `[]`) |
| `worker.js` | Ο κώδικας του Cloudflare Worker (αναφορά/backup) |

## Πώς δουλεύει η gallery

```
Admin ανεβάζει φωτό → Cloudinary (αποθήκευση εικόνας)
                    → Cloudflare Worker (κρατά το GitHub token κρυφό)
                    → gallery-data.json στο GitHub
                    → index.html διαβάζει live → εμφανίζεται σε όλους
```

Η Λαμπρινή μπορεί να ανεβάζει/αλλάζει φωτογραφίες **από οποιαδήποτε συσκευή**
(κινητό, tablet, υπολογιστή) μέσω του `admin.html`.

## Ανέβασμα στο GitHub

Ανέβασε **όλα** τα αρχεία (εκτός του README αν θες) στο repo:
`waterlovethessaloniki/WaterLove-`

Drag & drop στο GitHub → Commit. Το site γίνεται live στο:
`https://waterlovethessaloniki.github.io/WaterLove-/`

Ο πίνακας διαχείρισης:
`https://waterlovethessaloniki.github.io/WaterLove-/admin.html`

## Στοιχεία υποδομής

- **Cloudinary cloud:** `dwhsqj03w` · preset `waterlove_preset` (unsigned)
- **Worker URL:** `https://waterlove-worker.waterlovethessaloniki.workers.dev`
- **GitHub:** `waterlovethessaloniki/WaterLove-` (branch `main`)

## Κωδικός Admin

Προεπιλογή: `waterlove2024`
Αλλάζει στη γραμμή `const ADMIN_PASS` μέσα στο `admin.html`.

> ⚠️ Ο κωδικός admin είναι client-side — εμποδίζει απλούς χρήστες, αλλά δεν είναι
> κρυπτογραφικά ασφαλής. Η πραγματική ασφάλεια (το GitHub token) είναι στο Worker.
