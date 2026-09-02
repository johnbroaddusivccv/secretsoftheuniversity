# Broaddus Scientific Group — Website

A static, self-contained research-peptide storefront + information site. No build step, no dependencies, no server-side code — every page is plain HTML/CSS/JS and the whole catalog is data-driven.

## Run locally
Open a terminal in this folder and start any static server:

```bash
python3 -m http.server 8777
```

Then visit **http://localhost:8777**. (Opening `index.html` directly via `file://` mostly works, but a local server is recommended so cart/checkout/favorites persist correctly across pages.)

## Deploy
Upload the entire folder to any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, Amazon S3 + CloudFront, or any web server. `index.html` is the entry point. No configuration required.

## Structure
```
index.html          Home
shop.html           Catalog (search via ?q=, filter via ?cat=)
glossary.html       Peptide glossary (encyclopedia)
protocols.html      Protocols & Stacks (dosing chart + buyable stacks)
category.html       Category landing (?cat=<id>) + category index
product.html        Product detail (?id=<id>)
compare.html        Side-by-side compound comparison (up to 4)
favorites.html      Saved items
cart.html           Cart
checkout.html       Checkout (shipping, discount codes, bulk tiers)
order.html          Order confirmation (?id=<orderNo>)
orders.html         Order lookup
faq.html            FAQ
about.html          About / quality / shipping / terms / contact

assets/css/style.css   Design system (monochrome, Inter)
assets/js/data.js      Catalog data: PRODUCTS, CATEGORIES, STACKS, PROTOCOLS, RESEARCH_NOTES
assets/js/app.js       Shared logic: header/footer, cart, favorites, compare, orders, discounts, graphics
```

## Editing the catalog
Everything lives in **`assets/js/data.js`**. Add a product by adding one object to `PRODUCTS` (each becomes a glossary entry, a shop card, and a product page automatically). Vial/dropper/kit artwork is generated from the product's `form` field. Stock is the `stock` field (`"in"` / `"low"` / `"out"`). Discount codes live in `DISCOUNTS` in `app.js`; bulk tiers in `bulkDiscount()`.

## Payments (to add later)
Checkout captures orders to the browser and shows "payment instructions to follow." To go live, connect a payment processor at `createOrder()` in `app.js` and flip the order `status` from `awaiting-payment` to `paid`. Back-in-stock and notify captures are stored in `localStorage` (`broaddus_notify_v1`) ready to wire to email.

## Note
All products are presented strictly for **Research Use Only** — not for human or animal consumption. Dosing/protocol figures are educational references, not instructions.
