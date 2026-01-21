# Dashboard Showcase Implementation

## Overview
Added a new platform preview section to the homepage showcasing the Cashvio business dashboard, inspired by Connect Money's approach.

## Changes Made

### 1. New Component: PlatformPreview
**File**: `src/components/sections/platform-preview.tsx`

Features:
- Two-column layout (content + dashboard image)
- Responsive design with order switching on mobile
- Visual enhancements:
  - Gradient background glow effect behind the dashboard
  - Border and shadow on the image container
  - Optional floating stats cards showing metrics
- Feature list with checkmark icons
- Badge, title, description, and 4 key features

### 2. Homepage Integration
**File**: `src/app/[locale]/page.tsx`

- Imported PlatformPreview component
- Added between Features and Benefits sections
- Maintains locale support (English/Arabic)

### 3. Component Export
**File**: `src/components/sections/index.ts`

- Added export for PlatformPreview component

### 4. Translations

#### English (`messages/en.json`)
Added `home.platformPreview` section with:
- badge: "Powerful Dashboard"
- title: "Own and control your business from one place"
- description: Comprehensive dashboard description
- 4 feature points highlighting key capabilities
- Image alt text
- 2 stat labels and values (Daily Orders, Active Products)

#### Arabic (`messages/ar.json`)
Added `home.platformPreview` section with RTL-appropriate translations:
- badge: "لوحة تحكم قوية"
- title: "امتلك وتحكم في عملك من مكان واحد"
- description: Arabic translation of dashboard benefits
- 4 feature points in Arabic
- Image alt text in Arabic
- 2 stat labels with Arabic numerals

## Design Approach

Similar to Connect Money's implementation:
1. **Visual Impact**: Large dashboard screenshot with gradient glow
2. **Context**: Descriptive content explaining the value
3. **Features**: Bullet points highlighting key benefits
4. **Stats**: Optional floating cards showing real-time metrics
5. **Positioning**: Between main features and benefits to showcase the platform's power

## Page Flow
1. Hero (Introduction)
2. Features (What you can do)
3. **Platform Preview** (How it looks and works) ← NEW
4. Benefits (Why choose us)
5. CTA (Get started)

## Responsive Behavior
- **Desktop**: Dashboard image on right, content on left
- **Tablet/Mobile**: Dashboard image on top, content below
- Floating stats cards hidden on small screens to reduce clutter

## Image Requirements
- Path: `/assets/portal.png`
- Recommended dimensions: 1200x800px or similar aspect ratio
- Format: PNG for transparency support
- The image should show the main dashboard with key metrics visible

## Future Enhancements
Consider:
- Animation on scroll (fade-in, slide-up)
- Interactive demo button linking to live demo
- Multiple dashboard screenshots in a carousel
- Video demo instead of static image
- Click-through to detailed features page
