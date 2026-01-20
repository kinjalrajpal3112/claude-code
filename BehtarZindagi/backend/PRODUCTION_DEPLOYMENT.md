# Production Deployment Guide

## Quick Start Commands

### Step 1: Install Dependencies (Production Only)
```bash
npm ci --production
```

Or if you need all dependencies:
```bash
npm install
```

### Step 2: Build the Application
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 3: Start Production Server
```bash
npm run start:prod
```

Or set environment and run:
```bash
NODE_ENV=production npm run start:prod
```

---

## Complete Production Deployment Steps

### 1. Prepare Environment

```bash
# Copy environment template
cp config.env.example .env

# Edit .env file with production values
nano .env  # or use your preferred editor
```

**Important Production Environment Variables:**
```env
NODE_ENV=production
PORT=3000
DB_SYNCHRONIZE=false
DB_LOGGING=false
DB_SSL=true  # If using SSL for database
```

### 2. Install Dependencies

```bash
# Clean install (recommended for production)
npm ci --production

# Or standard install
npm install
```

### 3. Build the Application

```bash
npm run build
```

This creates the `dist/` folder with compiled JavaScript.

### 4. Start the Application

**Option A: Direct Node (Simple)**
```bash
NODE_ENV=production npm run start:prod
```

**Option B: Using PM2 (Recommended for Production)**

First install PM2 globally:
```bash
npm install -g pm2
```

Then start the application:
```bash
pm2 start dist/main.js --name behtarzindagi-api --env production
```

Or create a PM2 ecosystem file:
```bash
pm2 start ecosystem.config.js
```

**Option C: Using systemd (Linux)**
```bash
sudo systemctl start behtarzindagi-api
```

---

## Production Best Practices

### 1. Use Process Manager (PM2)

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'behtarzindagi-api',
    script: './dist/main.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-start on system reboot
```

### 2. Use Reverse Proxy (Nginx)

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Environment Variables

Make sure your `.env` file has:
- ✅ `NODE_ENV=production`
- ✅ `DB_SYNCHRONIZE=false` (NEVER use true in production!)
- ✅ `DB_LOGGING=false` (or true for debugging)
- ✅ Strong JWT secrets
- ✅ Correct database credentials
- ✅ Production API URLs

### 4. Security Checklist

- [ ] Set `DB_SYNCHRONIZE=false`
- [ ] Use strong JWT secrets
- [ ] Enable SSL for database if possible
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Use HTTPS (via reverse proxy)
- [ ] Keep dependencies updated
- [ ] Enable logging and monitoring

---

## One-Line Production Command

```bash
npm ci --production && npm run build && NODE_ENV=production npm run start:prod
```

---

## Verify Deployment

After starting, check if the server is running:

```bash
# Health check
curl http://localhost:3000/api/health

# Or check process
pm2 list  # If using PM2
ps aux | grep node  # If running directly
```

---

## Troubleshooting

### Application won't start
- Check if port 3000 is available: `lsof -i :3000`
- Verify `.env` file exists and has correct values
- Check database connection
- Review logs: `pm2 logs` or check console output

### Database connection issues
- Verify database credentials in `.env`
- Check database is running and accessible
- Ensure firewall allows connection
- Test connection: `psql -h <host> -U <user> -d <database>`

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`
- Verify Node.js version compatibility

---

## Monitoring

### PM2 Monitoring
```bash
pm2 monit          # Real-time monitoring
pm2 logs           # View logs
pm2 status         # Check status
pm2 restart all    # Restart all processes
pm2 stop all       # Stop all processes
```

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

---

## Update Application

```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm ci --production

# Rebuild
npm run build

# Restart
pm2 restart behtarzindagi-api  # If using PM2
# OR
NODE_ENV=production npm run start:prod  # If running directly
```

---

## Port Configuration

Default port is `3000`. To change it:

1. Set in `.env`:
   ```env
   PORT=8080
   ```

2. Or set as environment variable:
   ```bash
   PORT=8080 npm run start:prod
   ```

---

## Summary

**For Production, run these commands:**

```bash
# 1. Install dependencies
npm ci --production

# 2. Build the application
npm run build

# 3. Start the application
NODE_ENV=production npm run start:prod
```

**Or with PM2 (Recommended):**

```bash
npm ci --production
npm run build
pm2 start dist/main.js --name behtarzindagi-api --env production
pm2 save
pm2 startup
```

