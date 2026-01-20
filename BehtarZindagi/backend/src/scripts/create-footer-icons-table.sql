-- SQL Script to create footer_icons table
-- Run this script in your PostgreSQL database to create the table manually
-- 
-- Usage:
--   psql -U postgres -d behtarzindagi -f src/scripts/create-footer-icons-table.sql
--   OR
--   Connect to your database and run this SQL

CREATE TABLE IF NOT EXISTS footer_icons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on isActive for faster queries
CREATE INDEX IF NOT EXISTS idx_footer_icons_isActive ON footer_icons("isActive");

-- Create index on createdAt for sorting
CREATE INDEX IF NOT EXISTS idx_footer_icons_createdAt ON footer_icons("createdAt");

-- Add comment to table
COMMENT ON TABLE footer_icons IS 'Footer icons for the application navigation';

-- Add comments to columns
COMMENT ON COLUMN footer_icons.id IS 'Unique identifier for the footer icon';
COMMENT ON COLUMN footer_icons.name IS 'Display name of the footer icon';
COMMENT ON COLUMN footer_icons.icon IS 'Emoji or icon representation';
COMMENT ON COLUMN footer_icons."isActive" IS 'Whether the footer icon is active and should be displayed';
COMMENT ON COLUMN footer_icons."createdAt" IS 'Timestamp when the footer icon was created';
COMMENT ON COLUMN footer_icons."updatedAt" IS 'Timestamp when the footer icon was last updated';

-- Verify table creation
SELECT 
    'Table footer_icons created successfully!' AS status,
    COUNT(*) AS existing_records
FROM footer_icons;

