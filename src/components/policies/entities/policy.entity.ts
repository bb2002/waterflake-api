import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
