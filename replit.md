# Adera Ecosystem - Ethiopian Parcel Delivery & E-Commerce Platform

## Project Overview
Adera Ecosystem is a comprehensive Progressive Web Application (PWA) combining parcel delivery services (Adera-PTP) and e-commerce marketplace (Adera-Shops) designed specifically for the Ethiopian market. The platform serves users in Addis Ababa with culturally authentic design, multilingual support (English/Amharic), and integrated logistics solutions.

## Current Status
**Phase:** MVP Complete with Backend Integration  
**Version:** 1.0.0  
**Last Updated:** October 23, 2025

## Architecture

### Technology Stack
**Frontend:**
- React 18 with TypeScript
- Wouter for routing
- TanStack React Query for data fetching
- Shadcn UI + Tailwind CSS for components
- WebSocket client for real-time chat
- PWA capabilities (service worker ready)

**Backend:**
- Node.js + Express
- PostgreSQL (Neon/Supabase-compatible)
- Drizzle ORM for database management
- WebSocket server (ws) for real-time features
- bcrypt for password hashing
- QRCode generation for parcel tracking

**Design System:**
- Ethiopian color palette: Primary #228B22 (green), Secondary #FFD700 (gold), Accent #DC143C (red)
- Noto Sans Ethiopic + Noto Sans fonts for Amharic/English support
- Cultural imagery and geometric patterns
- Dark/light mode support

### Database Schema
**11 Core Tables:**
1. `users` - User accounts with roles (customer, partner, driver, personnel, admin, guest)
2. `partners` - Pickup/dropoff points and vendors
3. `shops` - Partner storefronts
4. `items` - Products in shops
5. `parcels` - Delivery parcels with QR tracking
6. `parcel_events` - Audit trail for parcel workflow
7. `orders` - E-commerce orders
8. `transactions` - Wallet transactions
9. `messages` - Real-time chat messages
10. `notifications` - User notifications
11. `repositories` - Saved notes/links/screenshots

## Features Implemented

### Phase 1: Core MVP ✅
- **Onboarding Flow**: 3-step introduction with Ethiopian cultural imagery
- **Authentication**: Login/signup with role-based registration + guest mode
- **Role Selection**: Visual card-based role picker (6 roles)
- **6 Role-Based Dashboards**:
  - Customer: Dual tabs for PTP parcels and Shops orders with real data
  - Partner: Shop management, parcel scanning, earnings display
  - Driver: Active deliveries, route view, QR scanning
  - Personnel: Hub operations, driver assignment
  - Admin: Global KPIs, user management, analytics placeholders
  - Guest: Limited browse access to marketplace and partner locations

### Phase 2: Backend Integration ✅
- **Authentication APIs**: `/api/auth/login`, `/api/auth/register`
- **Parcel Management**: Create parcels with QR generation, track by ID, update status
- **Shop/Items APIs**: CRUD operations for partners to manage inventory
- **Wallet System**: Add funds, view transaction history, balance updates
- **Real-Time Chat**: WebSocket server for customer-driver-support messaging
- **Notifications**: Create and fetch notifications by user

### Phase 3: Frontend-Backend Integration ✅
- **Customer Dashboard**: Fetches real parcels and orders via React Query
- **Parcel Creation**: Form submission creates actual database records with tracking IDs
- **Marketplace**: Displays real items from database with search functionality
- **Wallet**: Functional add funds with transaction history display
- **Loading States**: Proper loading indicators on all data-fetching components
- **Error Handling**: Toast notifications for success/failure states

## User Roles & Capabilities

### Customer
- Send parcels with recipient details, weight, payment method
- Track parcels in real-time via tracking ID
- Browse and purchase from local shops
- Manage wallet balance
- View parcel/order history

### Partner
- Manage shop inventory (add/edit products)
- Accept/release parcels at pickup/dropoff points
- QR scan parcels (single & bulk modes)
- View earnings and sales analytics
- Track performance metrics

### Driver
- View assigned parcels
- Scan QR codes at each delivery stage
- Update parcel status with delivery proof
- Track daily earnings and distance
- Chat with customers

### Personnel
- Scan and verify parcels at sorting hubs
- Assign parcels to drivers
- Report irregularities with photos
- Manage hub operations

### Admin
- View system-wide KPIs (parcels, orders, revenue, users)
- Manage users and partners
- Moderate disputes
- Configure system settings
- Access full audit logs

### Guest
- Browse marketplace (read-only)
- View partner locations
- Limited access - no transactions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user

### Users
- `GET /api/users/:id` - Get user by ID

### Partners
- `GET /api/partners` - List all partners
- `POST /api/partners` - Create partner
- `GET /api/partners/:id` - Get partner details

### Shops & Items
- `GET /api/shops/partner/:partnerId` - Get shops by partner
- `POST /api/shops` - Create shop
- `GET /api/items` - List all active items
- `GET /api/items/shop/:shopId` - Get items by shop
- `POST /api/items` - Create item

### Parcels
- `POST /api/parcels` - Create parcel (generates QR & tracking ID)
- `GET /api/parcels/sender/:senderId` - Get user's sent parcels
- `GET /api/parcels/driver/:driverId` - Get driver's parcels
- `GET /api/parcels/tracking/:trackingId` - Track parcel with events
- `PATCH /api/parcels/:id/status` - Update parcel status

### Orders
- `GET /api/orders/customer/:customerId` - Get customer orders
- `POST /api/orders` - Create order

### Transactions
- `GET /api/transactions/:userId` - Get user transactions
- `POST /api/transactions` - Create transaction (updates wallet)

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read

### QR Codes
- `GET /api/qr/:trackingId` - Generate QR code data URL

### WebSocket
- `ws://localhost:5000/ws` - Real-time chat endpoint

## File Structure

```
├── client/
│   ├── src/
│   │   ├── pages/           # Route components
│   │   │   ├── Onboarding.tsx
│   │   │   ├── RoleSelection.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── PartnerDashboard.tsx
│   │   │   ├── DriverDashboard.tsx
│   │   │   ├── PersonnelDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── GuestDashboard.tsx
│   │   │   ├── CreateParcel.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── ScanQR.tsx
│   │   │   └── Wallet.tsx
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # Shadcn components
│   │   │   └── layouts/
│   │   │       └── DashboardLayout.tsx
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── lib/
│   │   │   ├── i18n.ts      # Translations
│   │   │   └── queryClient.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   └── public/
│       └── manifest.json    # PWA manifest
├── server/
│   ├── db.ts                # Database connection
│   ├── storage.ts           # Data access layer
│   ├── routes.ts            # API endpoints + WebSocket
│   └── index.ts
├── shared/
│   └── schema.ts            # Drizzle schema + types
├── attached_assets/
│   └── generated_images/    # Ethiopian cultural images
├── design_guidelines.md     # Design system documentation
└── tailwind.config.ts
```

## Ethiopian Cultural Elements

### Generated Assets (6 images)
1. Addis Ababa skyline - Hero backgrounds
2. Ethiopian coffee ceremony - Authentication page
3. Marketplace with baskets - Shopping features
4. Delivery driver portrait - Driver dashboard
5. Shop owner portrait - Partner dashboard
6. Geometric patterns - Decorative elements

### Design Features
- Ethiopian flag colors (green, gold, red) throughout UI
- Noto Sans Ethiopic font for Amharic text
- Traditional Habesha geometric patterns
- Culturally appropriate imagery
- Bilingual support (English አማርኛ)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Push database schema
npm run db:push

# Force push schema (if conflicts)
npm run db:push --force
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key (auto-generated)
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` - Individual DB credentials

## Next Phase Priorities

### Phase 4: Advanced Features
1. **Payment Integration**: TeleBirr, Chapa, ArifPay actual API integration
2. **OpenStreetMap Integration**: Interactive map for partner selection
3. **QR Scanner**: Camera-based QR scanning using html5-qrcode
4. **Push Notifications**: Firebase Cloud Messaging integration
5. **Offline Support**: Service worker + IndexedDB caching
6. **Analytics Dashboard**: Recharts integration for data visualization
7. **Route Optimization**: Driver route planning algorithm
8. **Image Uploads**: Multer + Sharp for parcel/product photos

### Phase 5: Polish & Production
1. **End-to-End Testing**: Playwright tests for critical flows
2. **Performance Optimization**: Code splitting, lazy loading
3. **Accessibility Audit**: WCAG compliance
4. **Security Hardening**: Rate limiting, CSRF protection
5. **Documentation**: API docs, user guides
6. **Deployment**: Production database, CDN, monitoring

## Known Limitations (MVP)
- Payment methods are simulated (wallet updates locally)
- Maps show placeholders (no Leaflet integration yet)
- QR scanning requires manual entry (camera not implemented)
- Image uploads not functional (file handling pending)
- Analytics charts show static data
- No push notifications
- Limited offline support

## Testing Workflow
1. Create account via `/role-selection` → `/auth` (signup)
2. Navigate to role-specific dashboard
3. Customer: Create parcel → See in dashboard list
4. Customer: Add wallet funds → See transaction history
5. Browse marketplace (empty until partners add items)
6. Test language toggle (EN ↔ አማርኛ)
7. Test dark mode toggle
8. Logout and test guest mode

## User Preferences
- **Language**: Stored in localStorage, persists across sessions
- **Theme**: Dark/light mode preference saved
- **Auth State**: User object cached in localStorage

## Contributing
When adding features:
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to sync database
3. Add storage methods in `server/storage.ts`
4. Create API routes in `server/routes.ts`
5. Build frontend components with React Query integration
6. Add translations to `client/src/lib/i18n.ts`
7. Follow design guidelines in `design_guidelines.md`
8. Add `data-testid` attributes for testing

## Contact & Support
Project: Adera Ecosystem  
Target Market: Addis Ababa, Ethiopia  
Tech Stack: React + Express + PostgreSQL  
Status: MVP Complete - Backend Integrated
