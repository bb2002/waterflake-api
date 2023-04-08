import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TunnelEntity from '../../tunnels/entities/tunnel.entity';
import RegionEntity from '../../regions/entities/region.entity';

@Entity('wf_traffic_statistics')
export default class TrafficStatisticEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  _id: number;

  @Column({
    name: 'value',
    type: 'int',
    nullable: false,
  })
  value: number;

  @Index('ix_date_of_month')
  @Column({
    name: 'date_of_month',
    type: 'varchar',
    nullable: false,
  })
  dateOfMonth: string;

  @Index('ix_date_of_week')
  @Column({
    name: 'date_of_week',
    type: 'varchar',
    nullable: false,
  })
  dateOfWeek: string;

  @Index('ix_date')
  @Column({
    name: 'date',
    type: 'varchar',
    nullable: false,
  })
  date: string;

  @Index('ix_time')
  @Column({
    name: 'time',
    type: 'varchar',
    nullable: false,
  })
  time: string;

  @ManyToOne(() => TunnelEntity, (tunnel) => tunnel.trafficStatistics)
  tunnel: TunnelEntity;

  @ManyToOne(() => RegionEntity, (region) => region.trafficStatistic)
  region: RegionEntity;

  @CreateDateColumn()
  createdAt: Date;
}
