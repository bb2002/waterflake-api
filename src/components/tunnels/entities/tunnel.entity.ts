import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from '../../users/entities/user.entity';
import PlanEntity from '../../plans/entities/plan.entity';
import RegionEntity from '../../regions/entities/region.entity';

@Entity('wf_tunnels')
export default class TunnelEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    name: 'clientId',
    type: 'varchar',
    nullable: false,
  })
  clientId: string;

  @Column({
    name: 'clientSecret',
    type: 'varchar',
    nullable: false,
  })
  clientSecret: string;

  @Column({
    name: 'in_port',
    type: 'int',
    nullable: false,
  })
  inPort: number;

  @Column({
    name: 'out_port',
    type: 'int',
    nullable: false,
  })
  outPort: number;

  @ManyToOne(() => UserEntity, (user) => user.myTunnels)
  owner: UserEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.subscribedTunnels)
  plan: PlanEntity;

  @ManyToOne(() => RegionEntity, (region) => region.installedTunnels)
  region: RegionEntity;

  @CreateDateColumn()
  createdAt: Date;
}
