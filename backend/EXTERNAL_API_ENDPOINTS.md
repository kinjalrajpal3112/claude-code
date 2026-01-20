# Complete External API Endpoints List

## All External API Endpoints with Full Domain Names

### 📦 Product Management APIs
**Base Domain:** `https://behtarzindagi.in/BZFarmerApp_Live/api`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProducts` | Get all products with pagination (pageIndex, pageSize) |
| 2 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory` | Get main product categories |
| 3 | **POST** | `https://behtarzindagi.in/BZFarmerApp_Live/api/home/GetBZProductDetails` | Get detailed information about a specific product |
| 4 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetRelatedProducts` | Get related products based on product name |
| 5 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Livestock/GetProductsByPriceRange` | Search products filtered by price range and optional search text |
| 6 | **POST** | `https://behtarzindagi.in/BZFarmerApp_Live/api/BzCommonApi/GetBzShortVideosURLs` | Get short videos URLs with pagination |

---

### 🛒 Cart Management APIs
**Base Domain:** `https://behtarzindagi.in/BZFarmerApp_Live/api`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 7 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/BzWebsite/GetCartItems` | Get cart items for a user by mobile number |
| 8 | **POST** | `https://behtarzindagi.in/BZFarmerApp_Live/api/BzWebsite/AddToCartItems` | Add or remove item to/from cart (InType: "Add" or "Remove") |

---

### 📋 Order Management APIs
**Base Domain:** `https://behtarzindagi.in/BZFarmerApp_Live/api`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 9 | **POST** | `https://behtarzindagi.in/BZFarmerApp_Live/api/LiveStock/OrderCreateWebAddToCart` | Create order with cart checkout |
| 10 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/Get_OrderHistory` | Get order history for a farmer by Farmerid |
| 11 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/OrderStatus` | Get order status by recordid and orderid |
| 12 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/UpdateOrderStatusAfterPaymentGetway` | Update order status after payment gateway |
| 13 | **POST** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/CancelReason` | Cancel order with reason |

---

### 💳 Payment Management APIs
**Base Domain:** `https://behtarzindagi.in/Tractor_Api_Test`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 14 | **POST** | `https://behtarzindagi.in/Tractor_Api_Test/api/Payments/ToAcceptCustomerPaymentRequest` | Accept customer payment request (Razorpay initiation) |
| 15 | **POST** | `https://behtarzindagi.in/Tractor_Api_Test/api/Payments/ToCompletePaymentRequest` | Complete payment request with Razorpay verification |

---

### 👨‍🌾 Farmer & Location Management APIs

#### Base Domain: `https://behtarzindagi.in/BZFarmerApp_Live/api`
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 16 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetFarmerAddress` | Get farmer address by FarmerID (and optional Version) |

#### Base Domain: `https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc`
| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 17 | **POST** | `https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc/api/UpdateFarmerData` | Update farmer details (name, mobile, address, location, etc.) |
| 18 | **GET** | `https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc/api/GetStateDistrictBlockVilage` | Get State, District, Block, or Village data based on type (S/D/B/V) |

---

### 🎟️ Coupons & Cancel Reasons APIs
**Base Domain:** `https://behtarzindagi.in/BZFarmerApp_Live/api`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 19 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllActiveCoupons` | Get all active coupons by PackageId |
| 20 | **GET** | `https://behtarzindagi.in/BZFarmerApp_Live/api/Home/ProductCancelStatus` | Get product cancel status reasons by typeid |

---

### 🤝 Partner Order APIs
**Base Domain:** `https://behtarzindagi.in/Tractor_Api_Test`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 21 | **POST** | `https://behtarzindagi.in/Tractor_Api_Test/api/Partnership/ToMapPartnerOrderDetailsThirdPartyUserId` | Map partner order details with third party user ID |

---

### 🔐 OTP Authentication APIs (Optional)
**Base Domain:** `https://behtarzindagi.in`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 22 | **POST** | `https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseLogin` | Send OTP to user mobile number |
| 23 | **POST** | `https://behtarzindagi.in/Tractor_Api_Test/api/Home/CentraliseVerifyLogin` | Verify OTP and login user |

---

## Summary by Domain

### `https://behtarzindagi.in/BZFarmerApp_Live/api` (16 endpoints)
- Product browsing, search, and details
- Cart operations
- Order management
- Farmer address
- Coupons and cancel reasons

### `https://behtarzindagi.in/Tractor_Api_Test` (4 endpoints)
- Payment acceptance and completion
- Partner order mapping
- OTP authentication (if used)

### `https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc` (2 endpoints)
- Update farmer data
- Get State/District/Block/Village hierarchy

---

## Total: 22 External API Endpoints

**Note:** URLs may vary based on environment (development uses `http://localhost:43997` for some endpoints). The list above shows production URLs.

