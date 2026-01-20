# Simple API Structure

## Overview
Much simpler and cleaner code structure! No complex middleware or router systems.

## Files Structure

```
src/
├── main.ts                    # Simple server setup
├── controller/                # All controllers
│   ├── health.controller.ts
│   ├── products.controller.ts
│   └── website-user.controller.ts
├── service/                   # All services
│   ├── health.service.ts
│   ├── products.service.ts
│   ├── website-user.service.ts
│   ├── otp.service.ts
│   └── jwt.service.ts
├── dto/                       # All DTOs
├── common/
│   └── guards/
│       └── auth.guard.ts      # Simple auth guard
└── config/
    └── urls.config.ts         # URL configuration
```

## How Authentication Works

### Simple Auth Guard
- Just add `@UseGuards(AuthGuard)` to any endpoint that needs protection
- No complex middleware or router configuration

### Public Endpoints (No Auth Required)
- `GET /api/health`
- `POST /api/website-users/send-otp`
- `POST /api/website-users/verify-otp`
- `POST /api/website-users/login`

### Protected Endpoints (Auth Required)
- `GET /api/products` - Has `@UseGuards(AuthGuard)`
- `GET /api/website-users` - Has `@UseGuards(AuthGuard)`
- `POST /api/website-users` - Has `@UseGuards(AuthGuard)`
- All other user management endpoints

## Testing

```bash
# Send OTP (Public - no auth needed)
curl -X POST "http://localhost:3000/api/website-users/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"name": "Vishal", "number": "9871560356"}'

# Verify OTP (Public - no auth needed)
curl -X POST "http://localhost:3000/api/website-users/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{"name": "Vishal", "number": "9871560356", "otp": "51761"}'

# Get Products (Protected - needs JWT token)
curl -X GET "http://localhost:3000/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Benefits

✅ **Super Simple** - No complex middleware or router systems
✅ **Easy to Understand** - Just add `@UseGuards(AuthGuard)` where needed
✅ **Clean Code** - Removed all unnecessary files and complexity
✅ **Easy to Maintain** - Simple structure, easy to add new endpoints
✅ **Works Perfectly** - OTP endpoints are public, other endpoints are protected

Much better and simpler! 🎉
