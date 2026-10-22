# Rasa Bandung — Landing Page

Landing page kuliner Bandung untuk mahasiswa (HTML + Tailwind CSS + JavaScript, tanpa framework).
Hasil kelanjutan wireframe Figma Pekan 3.

## Struktur
- `index.html` — halaman utama (CSS sudah ter-build, tidak perlu proses apa pun untuk dibuka/di-deploy)
- `css/style.css` — hasil build Tailwind
- `js/main.js` — menu mobile, pencarian/chip, validasi + pengiriman formulir
- `img/` — foto
- `src/input.css`, `tailwind.config.js` — sumber Tailwind (hanya perlu jika mengubah gaya)

## Mengubah gaya (opsional)
    npm install
    npm run build      # atau: npm run dev

## Formulir
- **Netlify**: langsung berfungsi. Kiriman masuk di Netlify > Site > Forms.
- **GitHub Pages / Vercel / hosting lain**: buat form di https://formspree.io, lalu isi
  `FORM_ENDPOINT` di bagian atas `js/main.js` dengan URL-nya, mis. `https://formspree.io/f/xxxxxxx`.

## Deploy
**Netlify (paling mudah):** buka https://app.netlify.com/drop, seret folder ini (tanpa `node_modules`), selesai.
**GitHub Pages:** upload isi folder ke repo, Settings > Pages > Deploy from a branch > `main` / root.
