# Broaddus Scientific Group shop (/shop)

A plain, informative storefront: two departments (Chemicals and Peptides), category chips,
a four-across product grid, product pages with full specifications, a cart and a checkout
that emails the order to you. White and black with soft neumorphic surfaces and square corners.
No build step and no dependencies.

## Pages
- `index.html` — the shop. `?cat=<id>` picks a category, `?tab=peptides` opens Peptides, `?q=` searches.
- `product.html?id=<id>` — product page. Old one-per-compound ids (e.g. `piracetam`) still resolve.
- `cart.html`, `checkout.html`, `order.html` — cart, checkout, confirmation.
- `help.html` — contact, ordering, shipping, returns, testing & COAs, FAQ, about, terms, privacy.

## Editing the catalog: `assets/js/catalog.js`
- **chemicals**: one entry per listing (name, form, size, price). `cats` puts it in categories;
  `featured` shows it under Featured products, `isNew` under New releases.
- **peptides**: one entry per compound with a `sizes` list; `cat` is its peptide group.
- **status** on any product: `in`, `out` (badge, no add button), `backorder` (badge, "Pre order"),
  `delay` (badge "1–3 day delay").
- **Photos**: `img` (chemicals) or `sizes[].img` (peptides) is a path under `assets/img/` without
  `.webp`, normally `vials/<file>`. The vial images are generated with `tools/vial-labels/`;
  run it again after adding a product. Leave `img` empty and the shop draws a stand-in instead.
- Category names and the line under each category are in `chemCats` / `pepCats`.

## Chemical data
`assets/js/chemdata.js` holds identity data per compound (IUPAC name, CAS, PubChem CID, formula,
weight, SMILES, InChIKey) and `assets/img/structures/` the 2D drawings. Both are generated and checked by
`tools/chem-data/`; see its README before editing by hand.

## Settings: top of `assets/js/shop.js`
`SITE.email` (contact and order fallback), `freeShip` threshold and shipping rates.

## Orders
Checkout posts to `/api/order`, which emails the order to `ORDER_TO` (or `REQUEST_TO`, or
`GMAIL_USER`) using the same Gmail settings as the Shortage Watch form (`GMAIL_USER`,
`GMAIL_APP_PASSWORD` in Vercel → Settings → Environment Variables). No card is charged; you reply
with payment instructions and the lot COA. If email isn't configured, the confirmation page asks the
customer to email the order to you and keeps their cart.

All products are presented for laboratory research use only.
