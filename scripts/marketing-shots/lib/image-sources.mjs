/**
 * Curated Unsplash photo IDs for demo CVX products + seed categories.
 * License: Unsplash License (https://unsplash.com/license) — free commercial use.
 *
 * URL shape: https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=900&h=900&q=80
 */

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=900&q=80`;

/** CVX-001…040 — only missing ones need fetch; map covers all for re-runs */
export const PRODUCT_IMAGE_SOURCES = {
  'CVX-001': unsplash('photo-1521572163474-6864f9cf17ab'), // cotton t-shirt
  'CVX-002': unsplash('photo-1542272604-787c3835535d'), // slim jeans
  'CVX-003': unsplash('photo-1598033129183-c4f50c736f10'), // oxford shirt
  'CVX-004': unsplash('photo-1576566588028-4147f3842f27'), // knit sweater
  'CVX-005': unsplash('photo-1576995853123-5a10305d93c0'), // denim jacket
  'CVX-006': unsplash('photo-1539533018447-63fcce2678e3'), // overcoat
  'CVX-007': unsplash('photo-1549298916-b41d501d3772'), // leather sneakers
  'CVX-008': unsplash('photo-1542291026-7eec264c27ff'), // running shoes
  'CVX-009': unsplash('photo-1533867617858-e7b97e060509'), // suede loafers
  'CVX-010': unsplash('photo-1553062407-98eeb64c6a62'), // accessories / leather goods vibe
  'CVX-011': unsplash('photo-1601924994987-69e26d50dc26'), // silk scarf
  'CVX-012': unsplash('photo-1511499767150-a48a237f0083'), // aviator sunglasses
  'CVX-013': unsplash('photo-1590874103328-eac38a683ce7'), // canvas tote
  'CVX-014': unsplash('photo-1548036328-c9fa89d128fa'), // leather crossbody
  'CVX-015': unsplash('photo-1602810318383-e386cc2a3ccf'), // linen button-up
  'CVX-016': unsplash('photo-1473966968600-fa801b869a1a'), // chino trousers
  'CVX-017': unsplash('photo-1581655353564-df123a1eb820'), // ribbed tee
  'CVX-018': unsplash('photo-1594633312681-425c7b97ccd1'), // wide-leg pants
  'CVX-019': unsplash('photo-1434389677669-e08b4cac3105'), // cardigan
  'CVX-020': unsplash('photo-1551028719-00167b16eac5'), // bomber jacket
  'CVX-021': unsplash('photo-1483985988355-763728e1935b'), // raincoat / fashion outer
  'CVX-022': unsplash('photo-1591047139829-d91aecb6caea'), // trench / structured coat
  'CVX-023': unsplash('photo-1556821840-3a63f95609a7'), // fleece hoodie
  'CVX-024': unsplash('photo-1638247025967-b4e38f787b76'), // chelsea boots
  'CVX-025': unsplash('photo-1525966222134-fcfa99b8ae77'), // canvas slip-ons
  'CVX-026': unsplash('photo-1543163521-1bf539c55dd2'), // ankle boots
  'CVX-027': unsplash('photo-1603487742131-4160ec999306'), // espadrille sandals
  'CVX-028': unsplash('photo-1521369909029-2afed882baee'), // straw hat
  'CVX-029': unsplash('photo-1535632066927-ab7c9ab60908'), // hoop earrings
  'CVX-030': unsplash('photo-1576871337622-98d48d1cf531'), // beanie
  'CVX-031': unsplash('photo-1627123424574-724758594e93'), // leather wallet
  'CVX-032': unsplash('photo-1566150905458-1bf1fc113f0d'), // quilted shoulder bag
  'CVX-033': unsplash('photo-1553062407-98eeb64c6a62'), // weekender duffel
  'CVX-034': unsplash('photo-1594223274512-ad4803739b7c'), // clutch
  'CVX-035': unsplash('photo-1572804013309-59a88b7e92f1'), // floral midi dress
  'CVX-036': unsplash('photo-1566174053879-31528523f8ae'), // satin evening dress
  'CVX-037': unsplash('photo-1595777457583-95e059d581b8'), // cotton shirt dress
  'CVX-038': unsplash('photo-1506629082955-511b1aa562c8'), // yoga leggings
  'CVX-039': unsplash('photo-1518310383802-640c2de311b2'), // tank top
  'CVX-040': unsplash('photo-1591195853828-11db59a44f6b'), // training shorts
  'CVX-041': unsplash('photo-1541099649105-f69ad21f3246'), // skinny jeans
  'CVX-042': unsplash('photo-1582418702059-97ebafb35d09'), // straight jeans
  'CVX-043': unsplash('photo-1591195853828-11db59a44f6b'), // denim shorts
  'CVX-044': unsplash('photo-1576995853123-5a10305d93c0'), // denim shirt
  'CVX-045': unsplash('photo-1560750588-73207b1ef5b8'), // swimsuit
  'CVX-046': unsplash('photo-1570977890113-c189ef990d91'), // bikini
  'CVX-047': unsplash('photo-1562157873-818bc0726f68'), // swim trunks
  'CVX-048': unsplash('photo-1507525428034-b723cf961d3e'), // beach sarong / cover-up
  'CVX-049': unsplash('photo-1617331140180-e140adb28662'), // pajama set
  'CVX-050': unsplash('photo-1582719478250-c89cae4dc85b'), // robe
  'CVX-051': unsplash('photo-1591195853828-11db59a44f6b'), // sleep shorts
  'CVX-052': unsplash('photo-1624378439575-d8705ad7ae80'), // lounge pants
  'CVX-053': unsplash('photo-1594938291221-94f18cbb5660'), // blazer
  'CVX-054': unsplash('photo-1473966968600-fa801b869a1a'), // formal trousers
  'CVX-055': unsplash('photo-1564257631407-4deb1f99d992'), // silk blouse
  'CVX-056': unsplash('photo-1598033129183-c4f50c736f10'), // tuxedo shirt
  'CVX-057': unsplash('photo-1599643478518-a784e5dc4c8f'), // pendant necklace
  'CVX-058': unsplash('photo-1535632066927-ab7c9ab60908'), // pearl studs
  'CVX-059': unsplash('photo-1611591437281-460bfbe1220a'), // gold bracelet
  'CVX-060': unsplash('photo-1605100804763-247f67b3557e'), // cocktail ring
  'CVX-061': unsplash('photo-1503919545889-aef636e10ad0'), // kids tee
  'CVX-062': unsplash('photo-1519238263530-99bdd11df2ea'), // kids joggers
  'CVX-063': unsplash('photo-1503919005314-30d934dba9e0'), // kids rain jacket
  'CVX-064': unsplash('photo-1514989940723-e8e51635b782'), // kids sneakers
  'CVX-065': unsplash('photo-1607345366928-199ea26cfe3e'), // flannel shirt
  'CVX-066': unsplash('photo-1581655353564-df123a1eb820'), // knit polo
  'CVX-067': unsplash('photo-1624378439575-d8705ad7ae80'), // cargo pants
  'CVX-068': unsplash('photo-1544923246-77307dd628fd'), // puffer vest
  'CVX-069': unsplash('photo-1603487742131-4160ec999306'), // platform slides
  'CVX-070': unsplash('photo-1551028719-00167b16eac5'), // biker jacket

  // Pre-existing demo / Arabic catalogue products (non-CVX)
  'EXAMPCLE-001': unsplash('photo-1521572163474-6864f9cf17ab'), // Classic T-Shirt
  'EXAMPXXLE-002': unsplash('photo-1598033129183-c4f50c736f10'), // قميص قطن كلاسيك
  '--ZQ4D': unsplash('photo-1553062407-98eeb64c6a62'), // حزام ساتان (accessory / leather)
  '--Z0EA': unsplash('photo-1566174053879-31528523f8ae'), // فستان سلفر
  '-2-SDR5': unsplash('photo-1441986300917-64674bd600d8'), // عميل 2 (generic apparel)
  'CATEGORY-1-S1XB': unsplash('photo-1489987707025-941f729c745d'), // Category 1 product
  'o-1': unsplash('photo-1489987707025-941f729c745d'), // Okkkkk (generic clothing)
};

/** Alternate Unsplash URLs if the primary 404s / redirects badly */
export const PRODUCT_IMAGE_FALLBACKS = {
  'CVX-021': unsplash('photo-1515886657613-9f3515b0c78f'), // fashion outerwear
  'CVX-022': unsplash('photo-1539533018447-63fcce2678e3'),
  'CVX-024': unsplash('photo-1543163521-1bf539c55dd2'),
  'CVX-034': unsplash('photo-1584917865442-de89df76afd3'),
  'CVX-039': unsplash('photo-1571019613454-1cb2f99b2d8b'),
  'CVX-045': unsplash('photo-1507525428034-b723cf961d3e'),
  'CVX-046': unsplash('photo-1515886657613-9f3515b0c78f'),
  'CVX-049': unsplash('photo-1523381210434-271e8be1f52b'),
  'CVX-050': unsplash('photo-1441986300917-64674bd600d8'),
  'CVX-053': unsplash('photo-1507679799987-c73779587ccf'),
  'CVX-057': unsplash('photo-1515562141207-7a88fb7ce338'),
  'CVX-061': unsplash('photo-1521572163474-6864f9cf17ab'),
  'CVX-068': unsplash('photo-1539533018447-63fcce2678e3'),
  '--ZQ4D': unsplash('photo-1553062407-98eeb64c6a62'), // leather goods / accessory
  'o-1': unsplash('photo-1441986300917-64674bd600d8'),
  'CATEGORY-1-S1XB': unsplash('photo-1523381210434-271e8be1f52b'),
};

/** Default photo when a product has no SKU-specific map */
export const DEFAULT_PRODUCT_IMAGE = unsplash(
  'photo-1441986300917-64674bd600d8',
);

/** Seed + other demo categories that show in the catalogue */
export const CATEGORY_IMAGE_SOURCES = {
  Apparel: unsplash('photo-1441986300917-64674bd600d8'), // clothing store rack
  Clothing: unsplash('photo-1489987707025-941f729c745d'), // clothes / folded shirts
  Clothes: unsplash('photo-1489987707025-941f729c745d'),
  Outerwear: unsplash('photo-1539533018447-63fcce2678e3'), // coats
  Footwear: unsplash('photo-1460353581641-37baddab0fa2'), // shoes
  Accessories: unsplash('photo-1523170335258-f5ed11844a49'), // watch / accessories
  Bags: unsplash('photo-1553062407-98eeb64c6a62'), // bags
  Dresses: unsplash('photo-1595777457583-95e059d581b8'), // dress
  Activewear: unsplash('photo-1517836357463-d25dfeac3438'), // activewear / gym
  Swimwear: unsplash('photo-1507525428034-b723cf961d3e'), // beach / swim
  Loungewear: unsplash('photo-1523381210434-271e8be1f52b'), // soft lounge stacks
  Formalwear: unsplash('photo-1507679799987-c73779587ccf'), // suit / formal
  Jewelry: unsplash('photo-1515562141207-7a88fb7ce338'), // jewelry flatlay
  Kids: unsplash('photo-1503919545889-aef636e10ad0'), // kids fashion
  Denim: unsplash('photo-1541099649105-f69ad21f3246'), // denim
  ملابس: unsplash('photo-1489987707025-941f729c745d'), // Arabic "clothes"
  فساتين: unsplash('photo-1595777457583-95e059d581b8'), // dresses
  احذيه: unsplash('photo-1460353581641-37baddab0fa2'), // shoes
  'Category 1': unsplash('photo-1523381210434-271e8be1f52b'),
  Hhhi: unsplash('photo-1441986300917-64674bd600d8'),
};

export const CATEGORY_IMAGE_FALLBACKS = {
  Accessories: unsplash('photo-1511499767150-a48a237f0083'),
  Activewear: unsplash('photo-1571019613454-1cb2f99b2d8b'),
  Clothing: unsplash('photo-1441986300917-64674bd600d8'),
  Clothes: unsplash('photo-1441986300917-64674bd600d8'),
  ملابس: unsplash('photo-1441986300917-64674bd600d8'),
  Swimwear: unsplash('photo-1515886657613-9f3515b0c78f'),
  Loungewear: unsplash('photo-1441986300917-64674bd600d8'),
  Formalwear: unsplash('photo-1594938291221-94f18cbb5660'),
  Jewelry: unsplash('photo-1599643478518-a784e5dc4c8f'),
  Kids: unsplash('photo-1521572163474-6864f9cf17ab'),
  Denim: unsplash('photo-1582418702059-97ebafb35d09'),
};
