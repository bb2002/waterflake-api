import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wf_policies')
export default class PolicyEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Index('ix_key')
  @Column({
    name: 'key',
    type: 'varchar',
    nullable: false,
  })
  key: string;

  @Column({
    name: 'value',
    type: 'varchar',
    nullable: true,
  })
  value: string;

  @CreateDateColumn()
  createdAt: Date;
}
