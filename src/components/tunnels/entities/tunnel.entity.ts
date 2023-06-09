import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from '../../users/entities/user.entity';
import PlanEntity from '../../plans/entities/plan.entity';
import RegionEntity from '../../regions/entities/region.entity';
import RootDomain from '../../../common/enums/RootDomain';
import TrafficStatisticEntity from '../../statistics/entities/traffic-statistic.entity';

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

  @Index('ix_sub_domain')
  @Column({
    name: 'sub_domain',
    type: 'varchar',
    nullable: false,
  })
  subDomain: string;

  @Column({
    name: 'root_domain',
    type: 'varchar',
    nullable: false,
  })
  rootDomain: RootDomain;

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

  @Column({
    name: 'dns_record_id',
    type: 'varchar',
    nullable: false,
  })
  DNSRecordId: string;

  @ManyToOne(() => UserEntity, (user) => user.myTunnels)
  owner: UserEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.subscribedTunnels)
  plan: PlanEntity;

  @ManyToOne(() => RegionEntity, (region) => region.installedTunnels)
  region: RegionEntity;

  @OneToMany(
    () => TrafficStatisticEntity,
    (trafficStatistic) => trafficStatistic.tunnel,
  )
  trafficStatistics: TrafficStatisticEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
