import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TunnelEntity from '../../tunnels/entities/tunnel.entity';
import TrafficStatisticEntity from '../../statistics/entities/traffic-statistic.entity';

@Entity('wf_regions')
export default class RegionEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'access_token',
    type: 'varchar',
    nullable: false,
  })
  accessToken: string;

  @Column({
    name: 'start_port_range',
    type: 'int',
    nullable: false,
  })
  startPortRange: number;

  @Column({
    name: 'end_port_range',
    type: 'int',
    nullable: false,
  })
  endPortRange: number;

  @Column({
    name: 'srv_target',
    type: 'varchar',
    nullable: false,
  })
  SRVTarget: string;

  @Column({
    name: 'api_endpoint',
    type: 'varchar',
    nullable: false,
  })
  apiEndPoint: string;

  @OneToMany(() => TunnelEntity, (tunnel) => tunnel.region)
  installedTunnels: TunnelEntity[];

  @OneToMany(
    () => TrafficStatisticEntity,
    (trafficStatistic) => trafficStatistic.region,
  )
  trafficStatistic: TrafficStatisticEntity[];
}
