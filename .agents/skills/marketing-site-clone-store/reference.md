# Clone Store — API & Theme Reference

## Auth

| Call | Path | Body / notes |
| --- | --- | --- |
| Refresh | `POST /v1/auth/refresh` | `{ refreshToken }` — access token only in `Set-Cookie: cv_access_token` |
| Login | `POST /v1/auth/login` | `{ username, password, audience: "SYSTEM" \| "TENANT" }` |

Use Bearer `cv_access_token` and/or Cookie jar. Body never contains tokens.

## System: create tenant

`POST /v1/system/tenants` (permission `create:tenant`)

```json
{
  "name": "Store Name",
  "hasCompletedFeatureSelection": true,
  "planId": "<optional uuid>",
  "contactPhone": "+201234567890",
  "adminUser": {
    "email": "admin@example.com",
    "password": "StrongP@ssw0rd!",
    "firstName": "Store Name",
    "lastName": "Admin",
    "username": "admin"
  }
}
```

Response includes `id`, `adminUser` (no password), `storeSubdomain`.
Default store + empty storefront are created. Resolve `storeId` via tenant login → `GET /v1/tenant/stores`.

## Tenant: catalogue

| Action | Path | Body highlights |
| --- | --- | --- |
| Create category | `POST /v1/tenant/categories` | `{ name }` |
| Create product | `POST /v1/tenant/products` | `name` (max 64), `categoryId`, `status: "active"`, `inventoryTrackable`, `availableOnStoreFront`, `variants: [{ sku, baseSellingPrice, basePurchasePrice }]` |
| Stock | `POST /v1/tenant/inventory/adjust-quantity/bulk` | `{ storeId, items: [{ variantId, quantity, reason, unitCost }] }` |
| Presign image | `POST /v1/files/presigned-upload-url` | `{ fileName, fileMimeType, fileType: "image", fileModule: "products" }` |
| Attach image | `POST /v1/tenant/products/:id/images` | `{ imageUrl: fileKey, altText, isPrimary, sortOrder }` |

## Tenant: storefront theme

| Action | Path |
| --- | --- |
| List themes | `GET /v1/tenant/store-front-themes` |
| List palettes | `GET /v1/tenant/store-front-palettes` |
| Update | `PATCH /v1/tenant/stores/:storeId/store-front` |

Stable theme/palette UUID prefix:

| Key | themeId suffix | paletteId suffix |
| --- | --- | --- |
| CLASSIC | `…0001` | `…0001` |
| WARM | `…0002` | `…0002` |
| FRESH | `…0003` | `…0003` |
| CARE | `…0004` | `…0004` |
| TECH | `…0005` | `…0005` |
| ELEGANT | `…0006` | `…0006` |
| EDITORIAL | `…0007` | `…0007` |
| PLAYFUL | `…0008` | `…0008` |

Theme prefix `0198a000-0000-7000-8000-00000000000N`  
Palette prefix `0198b000-0000-7000-8000-00000000000N`

Font presets: `DEFAULT|CLASSIC|MODERN|TECHNICAL|ELEGANT|FRIENDLY|CLEAN`  
Radius presets: `DEFAULT|SHARP|SOFT|ROUNDED|PILL`

## Run artifacts

```
scripts/clone-store/runs/<runId>/
  catalog.json
  session.system.json
  session.tenant.json
  tenant.json
  credentials.json          ← deliverable
  seeded-products.json
  images/
  images-manifest.json
  images-uploaded.json
  theme.json
```

## Related existing tooling

`scripts/marketing-shots/` — seed/capture for a **fixed** demo tenant. Clone-store provisions a **new** tenant then reuses the same API shapes.
