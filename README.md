# Casa Feliz — starter site

A static, responsive starter site for the Casa Feliz La Palma rental. Open `index.html` in a browser, or serve it with `python3 -m http.server` from this folder.

## Before publishing

- Confirm the current rental price, availability and house rules directly with the owners before publishing them here.
- Add the owners' preferred contact details and a privacy policy if collecting enquiries.
- The gallery uses locally stored property photos; `bedroom-1.jpg` through `bedroom-3.jpg` were cropped from the supplied accommodation screenshots.

## Availability calendar

The published `availability.json` contains only unavailable date ranges; it never contains Vrbo booking titles, guest details or the original iCal feed.

To enable the daily refresh, add the Vrbo export URL as the repository Actions secret `VRBO_ICAL_URL` (GitHub: **Settings → Secrets and variables → Actions → New repository secret**). The workflow can also be run manually from the Actions tab after the secret is saved.
