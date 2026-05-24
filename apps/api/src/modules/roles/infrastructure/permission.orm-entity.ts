import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('permissions')
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  key!: string;

  @ManyToMany(() => RoleOrmEntity, (role) => role.permissions)
  roles!: RoleOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
