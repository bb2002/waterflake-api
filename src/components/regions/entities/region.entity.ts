import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    name: 'dns_record_name',
    type: 'varchar',
    nullable: false,
  })
  dnsRecordName: string;

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
}
