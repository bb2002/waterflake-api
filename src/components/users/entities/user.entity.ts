import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LoginProvider from '../../../common/enums/LoginProvider';
import TunnelEntity from '../../tunnels/entities/tunnel.entity';

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

  @OneToMany(() => TunnelEntity, (tunnel) => tunnel.owner)
  myTunnels: TunnelEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
