import { DataSource } from 'typeorm';
import { FooterIcon } from '../entities/footer-icon.entity';

/**
 * Seed script to insert initial footer icons
 * 
 * Run this script to populate the database with default footer icons:
 * - Home🏠
 * - Categories 🗂️
 * - Videos 🎬
 * - Community 👥
 * 
 * Usage:
 *   ts-node src/scripts/seed-footer-icons.ts
 * 
 * Or with npm script:
 *   npm run seed:footer-icons
 */

const defaultFooterIcons = [
  { name: 'Home', icon: '🏠', isActive: true },
  { name: 'Categories', icon: '🗂️', isActive: true },
  { name: 'Videos', icon: '🎬', isActive: true },
  { name: 'Community', icon: '👥', isActive: true },
];

export async function seedFooterIcons(dataSource: DataSource): Promise<void> {
  const footerIconRepository = dataSource.getRepository(FooterIcon);

  console.log('🌱 Starting footer icons seed...');

  try {
    // Check if icons already exist
    const existingIcons = await footerIconRepository.find();
    
    if (existingIcons.length > 0) {
      console.log(`⚠️  Found ${existingIcons.length} existing footer icons. Skipping seed.`);
      console.log('💡 To re-seed, delete existing icons first or modify this script.');
      return;
    }

    // Insert default icons
    const icons = footerIconRepository.create(defaultFooterIcons);
    const savedIcons = await footerIconRepository.save(icons);

    console.log(`✅ Successfully seeded ${savedIcons.length} footer icons:`);
    savedIcons.forEach((icon) => {
      console.log(`   - ${icon.icon} ${icon.name} (${icon.id})`);
    });

    console.log('🎉 Footer icons seed completed!');
  } catch (error) {
    console.error('❌ Error seeding footer icons:', error);
    throw error;
  }
}

// If running directly (not imported)
if (require.main === module) {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'pass@123',
    database: process.env.DB_DATABASE || 'behtarzindagi',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  dataSource
    .initialize()
    .then(async () => {
      await seedFooterIcons(dataSource);
      await dataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during Data Source initialization:', error);
      process.exit(1);
    });
}

