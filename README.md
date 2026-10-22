# Fixs Arts Header

Header reusable: logo, menu tengah, dropdown (Tools), search, keranjang, sticky + animasi halus.

## Pakai di web lain
```html
<link rel="stylesheet" href="https://fixsarts.github.io/header/header.css">
<div id="fa-header-root"></div>
<script src="https://fixsarts.github.io/header/header.js"></script>
```
`<link>` dan `<div>` opsional: `header.js` memuat CSS sendiri dan membuat header di atas `<body>` bila root tidak ada.

## Ubah setting
Taruh sebelum `header.js`:
```html
<script>
  window.FixsHeaderConfig = {
    cartCount: 2,
    hideOnScrollDown: true,
    links: [
      { label: "Home", href: "/" },
      { label: "Tools", children: [{ label: "Nota", href: "/nota" }] }
    ]
  };
</script>
```
Opsi: `logoUrl, brand, homeUrl, cartUrl, cartCount, showSearch, showCart, searchPlaceholder, theme ("dark"|"light"), hideOnScrollDown, mount, onSearch, links`.

## API
- `FixsHeader.setCart(n)` – ubah angka badge keranjang
- Event `fixsarts:search` – `document.addEventListener("fixsarts:search", e => e.detail.q)`

## GitHub Pages
Upload `header.css` dan `header.js` ke repo `fixsarts/header`, aktifkan Pages, lalu pakai URL di atas.
