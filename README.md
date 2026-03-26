# E-Commerce Application (Next.js + MongoDB)

A modern mini e-commerce app implemented in **Next.js 16+** with full shopping flow:
- product browsing
- cart management
- checkout with order creation
- admin inventory management
- secure route-based admin checks

Built as an assignment project and ready for GitHub portfolio, deployment, and further feature expansion.

---

## ✅ Implemented Features

### Product catalog
- Display product listing with category filters (tops, bottoms, shoes)
- Featured product carousel
- Product detail pages with description, stock quantity, category, and image
- Add to cart from product details

### Cart management (client-side store)
- Add item to cart with quantity merging
- Remove item from cart
- Update quantity per cart item
- Clear entire cart
- Total items & total price calculations
- Persistent cart state via custom store (`zustand`-style consumer API)

### Checkout & order placement
- Checkout form (`/checkout`) with user details, shipping address, and notes
- Client-side form validation using `react-hook-form` (required field checks, minimum length, valid formats)
- Pre-filled user name/email from Clerk auth
- Cart summary and price breakdown
- `POST /api/orders` creates order with transaction-safe stock decrement
- Order success confirmation and redirect to `/orders`

### Orders dashboard
- `/orders` shows all orders with status, payment method, total, date
- Supports real-time order list refresh (SSR / dynamic route)

### Admin product CRUD
- `/admin` listing all products
- `/admin/add` to create product with image upload (ImageKit)
- `/admin/update/[id]` to edit product details + image replacement
- Delete product with remote image cleanup
- `requireAdmin()` middleware to guard product APIs

### Navigation enhancement
- Top loader animation on route change/navigation events

### Backend API + validation
- `POST /api/products` - create product (admin-only)
- `GET|PUT|DELETE /api/products/[id]` - detail/update/delete (admin-only for mutating)
- `POST /api/orders` - place orders
- Form data validation (Zod) for both product and order payloads

---

## 🧩 Project Structure

- `app/` - Next.js App Router pages
- `components/` - UI and page components
- `models/` - Mongoose schemas (`product`, `order`)
- `app/api/` - route handlers for products and orders
- `schemas/` - Zod backend validation schemas
- `stores/` - cart store provider, cart actions
- `lib/` - `dbConnect`, `imagekit` helper
- `middleware/auth.ts` - admin permission checker

---

## ⚙️ Requirements Fulfilled

- Full stack e-commerce flows
- CRUD operations for products and orders
- Admin security (role-based authorization)
- File upload + external image storage (ImageKit)
- Persistent data with MongoDB via Mongoose
- Form validation + user-friendly error handling
- Responsive UI using Tailwind-style classes and custom component library

---

## 🛠️ Tech Stack

- Next.js 14.x (App Router)
- React, TypeScript
- MongoDB + Mongoose
- Next.js API routes
- Clerk authentication (`useUser`) for logged-in user info
- ImageKit for media uploads
- `react-hook-form`, `sonner` toasts
- `lucide-react` icons

---

## 🚀 Setup & Run

1. clone repo
2. install dependencies

```bash
pnpm install
```

3. create `.env` with:
- `MONGODB_URI`
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- `NEXT_PUBLIC_CLERK_...` if Clerk is used

4. run dev server

```bash
pnpm dev
```

5. open `http://localhost:3000`

---

## 🧪 Test / Usage Notes

- Admin routes require proper role set in user metadata (`role: admin`).
- Product image format restrictions: JPEG, PNG, WEBP and max 4MB.
- Order placement checks stock and updates inventory in a MongoDB transaction.

---

## 📦 Deployment

- Live demo: https://ecom-delta-teal.vercel.app/
- Deploy on Vercel (recommended). Ensure environment variables are set in production.

Optional: configure a MongoDB Atlas cluster and use authenticated Clerk config or any auth provider.

---

## 🎓 Notes

The project satisfies assignment intent: complete mini e-commerce features + admin product control + order handling + database/validation/security.

