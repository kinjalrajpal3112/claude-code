# Footer Icons - CURL Commands

## Insert Footer Icons via API

Use these curl commands to insert the 4 default footer icons into the database.

### Prerequisites
- Make sure your NestJS server is running (usually on `http://localhost:3000`)
- Ensure PostgreSQL database is configured and running

---

## 1. Insert Home Icon 🏠

```bash
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Home",
    "icon": "🏠",
    "isActive": true
  }'
```

---

## 2. Insert Categories Icon 🗂️

```bash
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Categories",
    "icon": "🗂️",
    "isActive": true
  }'
```

---

## 3. Insert Videos Icon 🎬

```bash
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Videos",
    "icon": "🎬",
    "isActive": true
  }'
```

---

## 4. Insert Community Icon 👥

```bash
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Community",
    "icon": "👥",
    "isActive": true
  }'
```

---

## Batch Insert Script (All 4 icons at once)

### Windows PowerShell:
```powershell
# Home
curl.exe -X POST http://localhost:3000/api/footer-icons -H "Content-Type: application/json" -d '{\"name\": \"Home\", \"icon\": \"🏠\", \"isActive\": true}'

# Categories
curl.exe -X POST http://localhost:3000/api/footer-icons -H "Content-Type: application/json" -d '{\"name\": \"Categories\", \"icon\": \"🗂️\", \"isActive\": true}'

# Videos
curl.exe -X POST http://localhost:3000/api/footer-icons -H "Content-Type: application/json" -d '{\"name\": \"Videos\", \"icon\": \"🎬\", \"isActive\": true}'

# Community
curl.exe -X POST http://localhost:3000/api/footer-icons -H "Content-Type: application/json" -d '{\"name\": \"Community\", \"icon\": \"👥\", \"isActive\": true}'
```

### Linux/Mac Bash:
```bash
#!/bin/bash

# Home
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{"name": "Home", "icon": "🏠", "isActive": true}'

# Categories
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{"name": "Categories", "icon": "🗂️", "isActive": true}'

# Videos
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{"name": "Videos", "icon": "🎬", "isActive": true}'

# Community
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{"name": "Community", "icon": "👥", "isActive": true}'
```

---

## Other Useful API Endpoints

### Get All Footer Icons
```bash
curl -X GET http://localhost:3000/api/footer-icons
```

### Get Only Active Footer Icons ⭐
```bash
curl -X GET "http://localhost:3000/api/footer-icons?isActive=true"
```

### Get Only Inactive Footer Icons
```bash
curl -X GET "http://localhost:3000/api/footer-icons?isActive=false"
```

### Get Specific Footer Icon by ID
```bash
curl -X GET http://localhost:3000/api/footer-icons/{icon-id}
```

### Update Footer Icon
```bash
curl -X PUT http://localhost:3000/api/footer-icons/{icon-id} \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

### Delete Footer Icon
```bash
curl -X DELETE http://localhost:3000/api/footer-icons/{icon-id}
```

---

## Example: Insert Additional Footer Icon

```bash
curl -X POST http://localhost:3000/api/footer-icons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Profile",
    "icon": "👤",
    "isActive": true
  }'
```

