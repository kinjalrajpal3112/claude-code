# 🗺️ BZAgro Frontend → Backend API Mapping

## ✅ CORRECT API MAPPINGS (Verified)

| Frontend Route | BZ Production API | Method |
|----------------|-------------------|--------|
| `/api/products` | `/Home/GetAllProducts` | GET |
| `/api/products/top-selling` | `/Home/GetAllProducts` (no separate API) | GET |
| `/api/products/categories` | `/Category/Get_MainCategory` | GET |
| `/api/products/details?PackageId=X` | `/home/GetBZProductDetails?PackageId=X` | GET |
| `/api/products/search?SearchText=X` | `/Livestock/GetProductsByPriceRange?SearchText=X` | GET |
| `/api/products/by-category` | `/Home/GetAllProductsByCatogory` | POST |
| `/api/videos` | `/BzCommonApi/GetBzShortVideosURLs` | GET |
| `/api/cart` | `/BzWebsite/GetCartItems` (GET) / `/BzWebsite/AddToCartItems` (POST) | GET/POST |
| `/api/auth/send-otp` | `/Tractor_Api_Test/api/Home/CentraliseLogin` | POST |
| `/api/auth/verify-otp` | `/Tractor_Api_Test/api/Home/CentraliseVerifyLogin` | POST |

## 🔴 NON-EXISTENT APIs (Removed)

| Wrong API | Status |
|-----------|--------|
| `/LiveStock/GetTopSellingProductsWeb` | ❌ Does NOT exist |

## 📊 Base URLs

| Purpose | Base URL |
|---------|----------|
| Main API | `https://behtarzindagi.in/BZFarmerApp_Live/api` |
| Payment API | `https://behtarzindagi.in/Tractor_Api_Test/api` |
| Legacy API | `https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc/api` |

## 🧪 Test URLs in Browser

```
https://behtarzindagi.in/BZFarmerApp_Live/api/Home/GetAllProducts?PageIndex=1&PageSize=10
https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory
https://behtarzindagi.in/BZFarmerApp_Live/api/home/GetBZProductDetails?PackageId=1234
```

