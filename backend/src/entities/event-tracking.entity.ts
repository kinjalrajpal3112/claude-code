import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Event Tracking Entity for PostgreSQL
 * 
 * @description Tracks user events with page URL and button clicked
 */
@Entity('event_tracking')
export class EventTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userUuid: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 500 })
  pageUrl: string;

  @Column({ type: 'varchar', length: 255 })
  buttonClicked: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  event: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

