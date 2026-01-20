import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Website Traffic Entity for PostgreSQL
 * 
 * @description Tracks website traffic with user UUID and UTM source
 */
@Entity('website_traffic')
export class WebsiteTraffic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userUuid: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_source: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

