# Store Front Implementation

## Overview

A modern, mobile-first responsive store front implementation for displaying product catalogues. Each store has its own unique URL path based on its store code.

## Architecture

### Backend (NestJS)

#### Public API Endpoint
- **Endpoint**: `GET /v1/public/stores/:code`
- **Description**: Retrieves complete store information including tenant, store front configuration, payment methods, fulfillment methods, and fees.
- **Authentication**: None required (public endpoint)
- **Caching**: Store data is cached server-side for optimal performance

#### Key Files
- `src/modules/stores/controllers/public.stores.controller.ts` - Public store controller
- `src/modules/stores/dtos/public-store.dto.ts` - Public store DTOs
- `src/modules/stores/mapper/public-store.mapper.ts` - Maps internal data to public DTOs
- `src/modules/stores/services/stores.service.ts` - Store service with `findByCode` method
- `src/modules/stores/repositories/stores.repository.ts` - Store repository

#### Features
- **No tenant ID required**: Uses unique store code for public access
- **Complete store data**: Includes tenant branding, store front config, payment/fulfillment methods, and fees
- **Presigned URLs**: Automatically generates presigned URLs for all images
- **Active filters**: Only returns active payment methods, fulfillment methods, and fees

### Frontend (Next.js 14)

#### Route Structure
```
/[locale]/store/[storeCode]
```

Example: `/en/store/ABC123`

#### Server-Side Rendering
The store front page uses Next.js Server Components for optimal performance:
- Store data is fetched server-side with 1-hour cache
- Categories are fetched server-side with 1-hour cache
- Products are fetched server-side with 5-minute cache
- SEO-optimized with dynamic metadata

#### Client-Side Caching
Store data is cached in localStorage for improved performance:
- **Store ID**
- **Tenant ID**
- **Store Code**
- **Store Name**
- **Currency**

#### Key Components

##### 1. StoreFrontClient
Main client component that orchestrates the store front experience.

**Features**:
- Manages search and category filter state
- Applies custom theme colors from tenant/store front
- Handles URL parameter updates
- Caches store data in localStorage

##### 2. StoreHeader
Displays store branding and information.

**Features**:
- Banner image (if configured)
- Store logo
- Store name and description
- Location information
- Contact details (phone and email)
- Mobile-responsive layout

##### 3. CategoryList
Horizontal scrolling category selector.

**Features**:
- Horizontal scroll with smooth animations
- Desktop: Shows scroll buttons
- Mobile: Touch-friendly swipe
- "All Categories" option
- Category images or default icons
- Active category highlighting with theme colors

##### 4. SearchBar
Debounced search input.

**Features**:
- Real-time search with 500ms debounce
- Clear button
- Mobile-optimized size
- Keyboard accessible

##### 5. ProductGrid
Responsive grid displaying products.

**Features**:
- Responsive grid (2 columns on mobile, 5 on desktop)
- Product images with hover effects
- Stock status badges
- Price formatting based on store currency
- Variant count display
- Pagination controls
- Empty state handling

## Design Principles

### Mobile-First
- All components are designed mobile-first
- Touch-friendly tap targets (minimum 44px)
- Responsive typography
- Optimized images

### Performance
- Server-side rendering for initial load
- Aggressive caching strategy
- Lazy loading for images
- Debounced search
- Minimal client-side JavaScript

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Proper heading hierarchy
- Focus management

### Theming
- Custom CSS variables for theme colors
- Supports both light and dark mode
- Tenant branding integration
- Store-specific color overrides

## API Services

### Store Service
```typescript
storeService.getByCode(code: string, config?: RequestConfig): Promise<PublicStore>
```

### Categories Service
```typescript
categoriesService.getAll(tenantId: string, config?: RequestConfig): Promise<PublicCategory[]>
```

### Products Service
```typescript
productsService.getAll(
  storeId: string,
  params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  },
  config?: RequestConfig
): Promise<PaginatedProducts>
```

## Utility Functions

### Store Cache
```typescript
// Save store data to localStorage
saveStoreCache(data: Omit<StoreCacheData, 'timestamp' | 'version'>): void

// Get store data from localStorage
getStoreCache(): StoreCacheData | null

// Clear store cache
clearStoreCache(): void

// Check if cached data matches current store
isCachedStore(storeCode: string): boolean
```

### Debounce Hook
```typescript
useDebounce<T>(value: T, delay: number): T
```

## File Structure

```
my-app/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       └── store/
│   │           └── [storeCode]/
│   │               ├── page.tsx              # Main page (Server Component)
│   │               ├── loading.tsx           # Loading state
│   │               ├── not-found.tsx         # 404 page
│   │               └── components/
│   │                   ├── store-front-client.tsx
│   │                   ├── store-header.tsx
│   │                   ├── category-list.tsx
│   │                   ├── search-bar.tsx
│   │                   ├── product-grid.tsx
│   │                   └── index.ts
│   └── lib/
│       ├── http/
│       │   ├── services/
│       │   │   └── store.service.ts   # Store, Categories, Products services
│       │   ├── server.ts              # Server-side wrappers
│       │   └── client.ts
│       └── utils/
│           ├── store-cache.ts         # localStorage caching utility
│           └── use-debounce.ts        # Debounce hook
```

## Usage Example

### Accessing a Store Front
```
https://yourapp.com/en/store/ABC123
```

### With Category Filter
```
https://yourapp.com/en/store/ABC123?categoryId=cat-uuid
```

### With Search
```
https://yourapp.com/en/store/ABC123?search=shoes
```

### With Pagination
```
https://yourapp.com/en/store/ABC123?page=2
```

## Customization

### Theme Colors
The store front respects the following color hierarchy:
1. Store Front primary/secondary colors (if configured)
2. Tenant primary/accent colors (fallback)
3. Default theme colors (final fallback)

Colors are applied via CSS custom properties:
```css
--store-primary
--store-secondary
```

### Branding
Each store can customize:
- Banner image
- Logo
- Display name
- Description
- Primary and secondary colors

## Best Practices

1. **Always validate store code** on the backend
2. **Cache aggressively** but invalidate appropriately
3. **Handle errors gracefully** with proper error boundaries
4. **Optimize images** with Next.js Image component
5. **Monitor performance** with Core Web Vitals
6. **Test on real devices** for touch interactions
7. **Implement proper loading states** for better UX

## Future Enhancements

- [ ] Product detail modal/page
- [ ] Shopping cart functionality
- [ ] Checkout flow
- [ ] Order tracking
- [ ] Customer reviews
- [ ] Product filtering (price, availability, etc.)
- [ ] Wishlist functionality
- [ ] Social sharing
- [ ] Analytics integration
- [ ] Progressive Web App (PWA) support

## Maintenance

### Adding New Features
1. Create the UI component
2. Add necessary API endpoints if needed
3. Update types in `store.service.ts`
4. Test on multiple devices and screen sizes
5. Update this documentation

### Performance Monitoring
- Monitor page load times
- Track API response times
- Analyze cache hit rates
- Review Core Web Vitals metrics

## Troubleshooting

### Store Not Found
- Verify the store code exists and is active
- Check the store's `isActive` flag
- Ensure the code is uppercase in the URL

### Images Not Loading
- Verify presigned URL generation
- Check image URL validity
- Ensure proper CORS configuration

### Slow Performance
- Review caching configuration
- Check database query performance
- Optimize image sizes
- Enable CDN for static assets

