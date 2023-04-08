import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TunnelEntity from '../../tunnels/entities/tunnel.entity';

@Entity('wf_connection_statistics')
export default class ConnectionStatisticEntity {
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

  @CreateDateColumn()
  createdAt: Date;
}
