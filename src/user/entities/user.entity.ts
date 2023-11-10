import { Score } from 'src/score/entities/score.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, default: 2 })
  role: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, default: '123' })
  password: string;

  @Column({ nullable: true })
  class: string;

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];
}
