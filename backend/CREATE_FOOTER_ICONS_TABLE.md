# Create Footer Icons Table

The table `footer_icons` doesn't exist yet. You have two options to create it:

## Option 1: Enable Auto-Synchronization (Recommended for Development)

Add this to your `.env` file:

```env
DB_SYNCHRONIZE=true
```

Then restart your NestJS server. TypeORM will automatically create the table.

**⚠️ Warning:** Set `DB_SYNCHRONIZE=false` in production!

---

## Option 2: Create Table Manually (Recommended for Production)

### Using psql command line:

```bash
psql -U postgres -d behtarzindagi -f src/scripts/create-footer-icons-table.sql
```

### Or using psql interactive:

```bash
psql -U postgres -d behtarzindagi
```

Then paste the SQL from `src/scripts/create-footer-icons-table.sql`

### Or using pgAdmin:

1. Open pgAdmin
2. Connect to your database
3. Right-click on your database → Query Tool
4. Copy and paste the SQL from `src/scripts/create-footer-icons-table.sql`
5. Execute

---

## Quick SQL Command:

```sql
CREATE TABLE IF NOT EXISTS footer_icons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_footer_icons_isActive ON footer_icons("isActive");
CREATE INDEX IF NOT EXISTS idx_footer_icons_createdAt ON footer_icons("createdAt");
```

---

## Verify Table Creation:

```sql
SELECT * FROM footer_icons;
```

---

## After Creating the Table:

1. Restart your NestJS server
2. Use the curl commands from `FOOTER_ICONS_CURL_COMMANDS.md` to insert footer icons
3. Or use the API endpoints shown in the console logs

---

## API Endpoints (after table is created):

- **GET** `http://localhost:3000/api/footer-icons` - Get all footer icons
- **POST** `http://localhost:3000/api/footer-icons` - Create new footer icon
- **GET** `http://localhost:3000/api/footer-icons/:id` - Get footer icon by ID
- **PUT** `http://localhost:3000/api/footer-icons/:id` - Update footer icon
- **DELETE** `http://localhost:3000/api/footer-icons/:id` - Delete footer icon

