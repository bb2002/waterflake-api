import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TunnelEntity from '../../tunnels/entities/tunnel.entity';

@Entity('wf_plans')
export default class PlanEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'price',
    type: 'int',
    nullable: false,
  })
  price: number;

  @Column({
    name: 'spec_max_speed',
    type: 'int',
    nullable: false,
  })
  maxSpeed: number;

  @Column({
    name: 'spec_min_domain_length',
    type: 'int',
    nullable: false,
  })
  minDomainLength: number;

  @Column({
    name: 'spec_support_custom_domain',
    type: 'boolean',
    nullable: false,
  })
  isSupportCustomDomain: boolean;

  @Column({
    name: 'is_enabled',
    type: 'boolean',
    nullable: false,
  })
  isEnabled: boolean;

  @OneToMany(() => TunnelEntity, (tunnel) => tunnel.plan)
  subscribedTunnels: TunnelEntity[];
}
