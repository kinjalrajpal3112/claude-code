# Get Main Categories API

## Endpoint

**GET** `/api/products/categories`

## Description

Retrieves main product categories from the external BehtarZindagi API.

## External API

The endpoint proxies the request to:
- **URL**: `https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory`
- **Method**: GET

---

## Usage

### Using cURL:

```bash
curl -X GET http://localhost:3000/api/products/categories
```

### Using cURL (with headers matching external API):

```bash
curl -X GET "http://localhost:3000/api/products/categories" \
  -H "accept: application/json, text/plain, */*" \
  -H "accept-language: en-IN,en;q=0.9" \
  -H "referer: https://behtarzindagi.in/" \
  -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
```

### Using PowerShell:

```powershell
curl.exe -X GET "http://localhost:3000/api/products/categories"
```

---

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "CategoryId": 1,
      "CategoryName": "Category 1",
      "CategoryImage": "https://example.com/image1.jpg",
      ...
    },
    {
      "CategoryId": 2,
      "CategoryName": "Category 2",
      "CategoryImage": "https://example.com/image2.jpg",
      ...
    }
  ],
  "timestamp": "2025-11-04T07:00:00.000Z"
}
```

---

## Console Logs

When you call this endpoint, you'll see in the console:

```
📋 [Products API] GET /api/products/categories
   External API: https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory

==================== CURL COMMAND ====================
curl -L "https://behtarzindagi.in/BZFarmerApp_Live/api/Category/Get_MainCategory" \
  -H "accept: application/json, text/plain, */*" \
  -H "referer: https://behtarzindagi.in/"
======================================================
```

---

## Notes

- The endpoint automatically includes proper headers (accept, referer, user-agent, etc.)
- Cookies are not required for this endpoint
- The response is cached and formatted by the backend service
- Error handling is included with proper HTTP status codes

