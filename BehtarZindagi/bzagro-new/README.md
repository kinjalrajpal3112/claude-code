# BZAgro - बेहतर ज़िंदगी E-commerce Platform

Agricultural equipment e-commerce platform with AI-powered product discovery.

## 🎨 Brand Colors

- **Primary Green:** `#059669` (emerald-600)
- **Primary Dark:** `#047857` (emerald-700)
- **Secondary/Accent:** `#f59e0b` (amber-500)
- **Danger/Discount:** `#ef4444` (red-500)

## 🚀 Features

- ✅ AI Product Discovery Bot integration
- ✅ Tractor Valuation Bot
- ✅ 538+ Combo Deals
- ✅ Razorpay Payment Gateway
- ✅ Mobile-first responsive design
- ✅ Hindi/English support
- ✅ WhatsApp integration

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── product/[id]/      # Product detail page
│   ├── checkout/          # Checkout page
│   ├── catalog/           # Product catalog
│   └── combos/            # Combo deals
├── components/
│   ├── Header.tsx         # Header with sidebar
│   └── BottomNav.tsx      # Bottom navigation
├── services/
│   └── api.ts             # API service (27 endpoints)
└── config/
    └── api.ts             # API & Razorpay config
```

## 🔌 API Endpoints

Base URL: `https://agromatic.behtarzindagi.in/api/api`

### Products
- `GET /products` - All products (paginated)
- `GET /products/categories` - Categories
- `POST /products/details` - Product details
- `GET /products/search-by-price` - Search
- `POST /products/by-category` - Filter by category
- `GET /products/top-selling` - Best sellers

### Cart & Orders
- `GET /products/cart-items` - Get cart
- `POST /products/cart` - Add to cart
- `POST /products/create-order` - Create order
- `GET /products/order-history` - Order history

### Payment
- `POST /products/accept-payment` - Init payment
- `POST /products/complete-payment` - Complete payment

### User
- `GET /website-users/send-otp-get` - Send OTP
- `GET /website-users/verify-otp-get` - Verify OTP
- `GET /products/farmer-address` - Get address

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

3. Add your Razorpay keys to `.env.local`

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero bots, combos, categories |
| Product | `/product/[id]` | Product details, buy now |
| Checkout | `/checkout` | Address, cart, payment |
| Catalog | `/catalog` | All products |
| Combos | `/combos` | 538 combo deals |

## 🎯 Key Features

### Hero Section (Top Priority)
1. **AI Bot** - Product discovery via conversation
2. **Tractor Valuation** - Get tractor value

### Combo Deals
- 538+ combos
- Savings up to 65%
- "Retailer can't match" USP

### Bottom Navigation
- Home
- Categories
- Combos (highlighted)
- BZ TV
- Account

## 💳 Razorpay Integration

Payment flow:
1. User clicks "Pay Now"
2. Razorpay modal opens
3. User selects UPI/Card/EMI (handled by Razorpay)
4. Payment success → Order confirmed

## 📞 Support

- Phone: 7876400500
- WhatsApp: wa.me/917876400500
- Bot: behtarbot.behtarzindagi.in

---

Built for बेहतर ज़िंदगी 🌾
