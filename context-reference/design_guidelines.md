# Adera Ecosystem - Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Combining Stripe's elegant onboarding flows and Notion's role-based interfaces with authentic Ethiopian cultural aesthetics. This creates a modern, trustworthy platform that resonates with local users while maintaining international UX standards.

## Core Design Principles
1. **Cultural Authenticity**: Ethiopian geometric patterns and traditional iconography integrated throughout
2. **Role Clarity**: Distinct visual hierarchies for Customer, Partner, Driver, Personnel, and Admin dashboards
3. **Trust & Transparency**: Clean layouts emphasizing security and reliability for financial transactions
4. **Mobile-First**: Optimized for Ethiopian mobile networks with offline-resilient design

---

## Color Palette

### Primary Colors
- **Ethiopian Green**: 141 69% 34% (Primary brand - CTA buttons, headers, active states)
- **Golden Yellow**: 51 100% 50% (Secondary - highlights, badges, success states)
- **Ethiopian Red**: 348 83% 47% (Accent - alerts, important notifications, active delivery status)

### Neutral Colors
- **Ghost White**: 240 100% 99% (Light mode backgrounds)
- **Dark Slate Grey**: 180 25% 25% (Primary text, headings)
- **Light Grey**: 0 0% 83% (Borders, dividers, disabled states)

### Functional Colors
- **Success Green**: 141 69% 40%
- **Warning Orange**: 38 92% 50%
- **Error Red**: 348 83% 47%
- **Info Blue**: 210 50% 45%

### Dark Mode
- Background: 180 20% 12%
- Surface: 180 15% 18%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 75%

---

## Typography

### Font Families
- **Primary (Amharic + Latin)**: 'Noto Sans Ethiopic', 'Noto Sans', system-ui, sans-serif
- **Headings**: 'Inter', 'Noto Sans Ethiopic', sans-serif (weight 600-700)
- **Body**: 'Noto Sans', 'Noto Sans Ethiopic', sans-serif (weight 400-500)
- **Monospace** (tracking IDs, codes): 'JetBrains Mono', monospace

### Type Scale
- **Hero Title**: 48px / 3rem (mobile: 32px)
- **H1**: 36px / 2.25rem (mobile: 28px)
- **H2**: 28px / 1.75rem (mobile: 24px)
- **H3**: 24px / 1.5rem (mobile: 20px)
- **H4**: 20px / 1.25rem
- **Body Large**: 18px / 1.125rem
- **Body**: 16px / 1rem
- **Small**: 14px / 0.875rem
- **Caption**: 12px / 0.75rem

### Line Heights
- Headings: 1.2
- Body: 1.6
- Captions: 1.4

---

## Layout System

### Spacing Units (Tailwind)
Consistent use of **4, 8, 12, 16, 20, 24, 32, 48, 64** (in px / 0.25rem increments)
- Micro spacing: p-2, gap-3
- Component spacing: p-4, p-5, gap-4
- Section spacing: py-12, py-16, py-20

### Grid System
- Mobile: Single column, max-w-full
- Tablet: 2 columns where appropriate (md:grid-cols-2)
- Desktop: 3-4 columns for cards (lg:grid-cols-3, xl:grid-cols-4)
- Content max-width: 1280px (max-w-7xl)

### Container Strategy
- Onboarding/Auth: max-w-md (centered)
- Dashboards: max-w-7xl with sidebar
- Forms: max-w-2xl
- Reading content: max-w-prose

---

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo (Ethiopian flag accent), role indicator, notifications bell, profile menu
- **Sidebar** (Desktop dashboards): Collapsible, icon + label, grouped by function
- **Bottom Nav** (Mobile): 4-5 primary actions with icons, active state in Ethiopian green
- **Tabs**: Underline style with Ethiopian green active indicator

### Cards
- Background: White (light) / Surface color (dark)
- Border: 1px solid light grey
- Border radius: 12px (rounded-xl)
- Shadow: sm on hover, md on elevated cards
- Padding: p-5 or p-6
- Ethiopian geometric border patterns on featured cards

### Buttons
- **Primary**: Ethiopian green background, white text, rounded-lg, px-6 py-3
- **Secondary**: Outline with Ethiopian green border, green text
- **Danger**: Ethiopian red background
- **Ghost**: Transparent with hover background
- **Icon Buttons**: Circular, 40px × 40px
- Blur background when overlaying images

### Forms
- Input height: 48px
- Border radius: 8px (rounded-lg)
- Focus ring: 2px Ethiopian green
- Label weight: 500
- Spacing between fields: gap-4

### Status Badges
- Rounded-full, px-3 py-1, text-sm
- Pending: Yellow background
- In Transit: Blue background
- Delivered: Green background
- Failed: Red background

### Data Display
- **Tables**: Striped rows, hover highlight, sticky headers
- **Analytics Cards**: fl_chart integration with Ethiopian color scheme
- **Progress Bars**: Ethiopian green fill, light grey track
- **QR Codes**: High contrast with Ethiopian flag corner accent

---

## Ethiopian Cultural Elements

### Geometric Patterns
- Traditional Habesha kemis patterns as subtle backgrounds
- Ethiopian cross motifs in decorative elements
- Basket weave patterns on dividers and borders

### Iconography
- Heroicons for standard UI (via CDN)
- Custom Ethiopian elements: coffee ceremony, injera, traditional architecture silhouettes
- Ethiopian flag colors in app icon and splash screen

### Photography Style
- Authentic Ethiopian street scenes (Addis Ababa)
- Local businesses, markets, traditional dress
- Warm, vibrant color grading
- Documentary-style authenticity

---

## Key Screens & Layouts

### Onboarding Flow (3-4 Screens)
- Hero image: Addis Ababa skyline or vibrant market scene
- Large heading with cultural greeting in Amharic + English
- Illustrated benefits with Ethiopian context
- Role selection with visual cards
- Smooth page transitions (slide/fade)

### Authentication
- Split layout: Form left, Ethiopian cultural image right
- Social proof: "Trusted by 50,000+ Ethiopians"
- Language toggle (English/Amharic) prominent
- Guest mode button clearly visible

### Customer Dashboard
- Welcome card with name in Amharic script
- Quick actions grid (2×2): Send Parcel, Track Order, Browse Shops, Wallet
- Recent deliveries timeline
- Shop recommendations carousel

### Partner Dashboard
- Revenue summary cards (4-column grid)
- Order table with QR scan action
- Inventory management with Ethiopian product categories
- Embedded map showing pickup/dropoff zones

### Driver Interface
- Active delivery card (large, prominent)
- Route map (OpenStreetMap) with Ethiopian green route line
- Scan QR FAB button (bottom right, pulsing)
- Earnings widget with daily/weekly toggle

### Admin Console
- KPI cards grid (6 metrics)
- Multi-line chart: deliveries, revenue, disputes
- User management table with role filters
- Heatmap of delivery density (Addis Ababa focused)

---

## Images & Media

### Hero Images
- **Landing/Onboarding**: Full-width hero (h-[60vh]) - Addis Ababa landmark or bustling marketplace
- **Authentication**: Right-side image (md:w-1/2) - Ethiopian coffee ceremony or traditional textiles
- **Role Dashboards**: Background pattern or header banner with cultural motifs

### Product/Partner Images
- Square aspect ratio (1:1) for consistency
- Rounded corners (rounded-lg)
- Hover zoom effect (scale-105)

### Delivery Proof Photos
- 3:2 aspect ratio
- Timestamp overlay
- Watermark with tracking ID

---

## Animations & Interactions
- Page transitions: 300ms ease-in-out
- Card hover: Subtle lift (translateY -2px)
- Button press: Scale 0.98
- Loading states: Ethiopian green spinner
- Success checkmarks: Animated green check with bounce
- Minimal use overall - prioritize performance

---

## Accessibility & Responsiveness
- WCAG AA contrast ratios maintained
- Keyboard navigation for all interactive elements
- Screen reader labels in Amharic and English
- Touch targets minimum 44px
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Consistent dark mode across all inputs and components

---

## Progressive Web App Features
- Offline indicator banner
- Install prompt with Ethiopian flag icon
- Splash screen with Adera logo + Ethiopian colors
- App icon: Modern "A" lettermark with tricolor accent