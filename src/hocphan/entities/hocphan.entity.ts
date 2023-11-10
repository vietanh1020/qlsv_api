import { Course } from 'src/course/entities/course.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Hocphan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  student_id: number;

  @Column({ nullable: false })
  course_id: number;

  // Đổi tên thuộc tính course_id thành course và sử dụng @ManyToOne để định nghĩa mối quan hệ.
  @ManyToOne(() => Course, (course) => course.hocphans)
  @JoinColumn({ name: 'course_id' }) // Định nghĩa tên cột trong database cho mối quan hệ
  course: Course;
}
