# Water Love - Website

Πολυσέλιδη ιστοσελίδα για το κατάστημα ενυδρείων Water Love (Λαμπρινή Μπιζίκη, Θεσσαλονίκη).

## Αρχεία site (ανέβασμα στο GitHub)

| Αρχείο | Τι είναι |
|--------|----------|
| `index.html` | Αρχική σελίδα (hero, σύντομο σχετικά, κατηγορίες, gallery) |
| `about.html` | Σχετικά - η ιστορία της Λαμπρινής + gallery |
| `products.html` | Προϊόντα (φορτώνονται live από GitHub) |
| `faq.html` | Συχνές ερωτήσεις |
| `contact.html` | Επικοινωνία, χάρτης, ώρες |
| `admin.html` | Πίνακας διαχείρισης (Gallery + Προϊόντα) |
| `styles.css` | Κοινό στυλ όλων των σελίδων |
| `app.js` | Κοινός κώδικας όλων των σελίδων |
| `gallery-data.json` | "Βάση" της gallery (ξεκινά `[]`) |
| `products-data.json` | "Βάση" των προϊόντων (22 αρχικά προϊόντα) |
| `worker.js` | Κώδικας Cloudflare Worker (αναφορά) |

## Δομή - ξεχωριστές σελίδες

Κάθε σελίδα είναι ξεχωριστό αρχείο HTML, μοιράζονται το ίδιο `styles.css` και `app.js`.
Το navigation menu συνδέει τις σελίδες με κανονικά links.

## Πώς δουλεύει η διαχείριση

```
Admin (admin.html) ανεβάζει → Cloudinary (φωτογραφία)
                            → Cloudflare Worker (κρατά token κρυφό)
                            → gallery-data.json ή products-data.json στο GitHub
                            → οι σελίδες διαβάζουν live → εμφανίζονται σε όλους
```

Η Λαμπρινή διαχειρίζεται **δύο** πράγματα από το admin:
1. **Συλλογή Φωτογραφιών** (gallery) - οι φωτογραφίες στην αρχική & σχετικά
2. **Προϊόντα** - τα προϊόντα στη σελίδα Προϊόντα (όνομα, κατηγορία, περιγραφή, φωτό)

Λειτουργεί από **οποιαδήποτε συσκευή**.

## Ανέβασμα στο GitHub

Ανέβασε όλα τα αρχεία στο repo `waterlovethessaloniki/WaterLove-`.
ΠΡΟΣΟΧΗ: το `gallery-data.json` υπάρχει ήδη - μην το αντικαταστήσεις αν έχει δεδομένα.
Το `products-data.json` πρέπει να ανέβει (έχει τα 22 αρχικά προϊόντα).

Site: `https://waterlovethessaloniki.github.io/WaterLove-/`
Admin: `https://waterlovethessaloniki.github.io/WaterLove-/admin.html`

## Worker - σημαντικό

Ο νέος `worker.js` υποστηρίζει **δύο** αρχεία (gallery + products).
Πρέπει να αντιγράψεις τον νέο κώδικα στο Cloudflare Worker και να κάνεις Deploy ξανά.

## Στοιχεία υποδομής

- Cloudinary: `dwhsqj03w` / preset `waterlove_preset`
- Worker: `https://waterlove-worker.waterlovethessaloniki.workers.dev`
- GitHub: `waterlovethessaloniki/WaterLove-` (branch main)

## Κωδικός Admin

Προεπιλογή: `waterlove2024` (αλλάζει στη γραμμή `const ADMIN_PASS` στο admin.html)
