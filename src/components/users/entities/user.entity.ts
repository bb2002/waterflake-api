import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wf_users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'sns_id',
    type: 'varchar',
    nullable: false,
  })
  snsId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  thumbnailUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
