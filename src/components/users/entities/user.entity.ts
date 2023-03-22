import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LoginProvider from '../../../common/enums/LoginProvider';

@Entity('wf_users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Index('ix_sns_id')
  @Column({
    name: 'sns_id',
    type: 'varchar',
    nullable: false,
  })
  snsId: string;

  @Column({
    name: 'login_provider',
    type: 'varchar',
    nullable: false,
  })
  loginProvider: LoginProvider;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Index('ix_email')
  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    nullable: true,
  })
  thumbnailUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
