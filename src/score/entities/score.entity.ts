// Trong file score.entity.ts
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  middle: number;

  @Column({ nullable: true })
  final: number;

  @Column({ nullable: true })
  total: number;

  @Column()
  updateAt: Date;

  // Đổi tên thuộc tính course_id thành course và sử dụng @ManyToOne để định nghĩa mối quan hệ.
  @ManyToOne(() => Course, (course) => course.scores)
  @JoinColumn({ name: 'course_id' }) // Định nghĩa tên cột trong database cho mối quan hệ
  course: Course;

  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'user_id' }) // Định nghĩa tên cột trong database cho mối quan hệ
  user: User;
}
