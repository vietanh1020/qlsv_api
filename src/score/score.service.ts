import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Score)
    private readonly scoreRepo: Repository<Score>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async svGetDiem(id: number) {
    const data = await this.scoreRepo
      .createQueryBuilder('Score')
      .leftJoinAndSelect('Score.course', 'Course')
      .where('Score.user_id = :id', { id })
      .getMany();

    return data.map((element) => {
      const { course, ...tmp } = element;
      delete tmp.id;
      return {
        courseId: course.id,
        name: course.name,
        soTc: course.so_tc,
        ...tmp,
      };
    });
  }

  convertToLetterGrade(score) {
    if (score >= 9) return 'A';
    if (score >= 8) return 'B';
    if (score >= 7) return 'C';
    if (score >= 4) return 'D';
    return 'F';
  }

  async demDiem(id: number) {
    const scores = this.scoreRepo
      .createQueryBuilder('score')
      .leftJoin('score.sv', 'sv')
      .select(['score.total'])
      .where('sv.id = :id', { id })
      .getMany();

    const scoreValues = (await scores).map((score) => score.total);

    const letterGrades = scoreValues.map((score) =>
      this.convertToLetterGrade(score),
    );
    const count = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    for (const grade of letterGrades) {
      if (count.hasOwnProperty(grade)) {
        count[grade]++;
      }
    }
    return count;
  }

  // async adminGetDiem(student_id?: number, class_id?: number) {
  //   if (!student_id && !class_id) throw new BadRequestException();
  //   const where = student_id ? { student_id } : { class_id };
  //   return await this.scoreRepo.find({
  //     where,
  //   });
  // }

  async adminGetDiemCourse(id: number) {
    return this.scoreRepo
      .createQueryBuilder('Score')
      .leftJoinAndSelect('Score.course', 'Course')
      .leftJoinAndSelect('Score.user', 'User')
      .where('Score.course.id = :courseId', { courseId: id })
      .select([
        'Score',
        'User.firstName',
        'User.lastName',
        'User.class',
        'User.email',
      ])
      .getMany();
  }

  async adminGetDiemCourseSV(id: number, student_name: string) {
    return this.scoreRepo
      .createQueryBuilder('Score')
      .leftJoinAndSelect('Score.course', 'Course')
      .leftJoinAndSelect('Score.user', 'User')
      .where(
        'Score.course.id = :courseId and User.lastName LIKE :studentName',
        { courseId: id, studentName: `%${student_name}%` },
      )
      .select([
        'Score',
        'User.firstName',
        'User.lastName',
        'User.class',
        'User.email',
      ])
      .getMany();
  }

  // async adminGetDiemCourseSV(id: number, student_name: string) {
  //   return this.scoreRepo
  //     .createQueryBuilder('Score')
  //     .leftJoinAndSelect('Score.course', 'Course')
  //     .leftJoinAndSelect('Score.user', 'User')
  //     .where('Score.course.id = :courseId and Score.user.lastName LIKE student_name', { courseId: id, student_name })
  //     .select(['Score', 'User.firstName', 'User.lastName', 'User.class', 'User.email'])
  //     .getMany();

  // }

  // async update(updateScoreDto: UpdateScoreDto) {
  //   const { student_id, course_id } = updateScoreDto;
  //   const score = await this.scoreRepo.find({
  //     where: {
  //       student_id,
  //       course,
  //     },
  //   });

  //   if (score) return await this.scoreRepo.update(score[0].id, updateScoreDto);
  //   return await this.scoreRepo.save(updateScoreDto);
  // }

  async uploadCSV(updateScoresDto: UpdateScoreDto[]) {
    try {
      for (const item of updateScoresDto) {
        await this.scoreRepo.save(item);
      }
      return true;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateDiemSV(id_course: number, updateScoreDto: UpdateScoreDto) {
    const existingUser = await this.userRepo.findOne({
      where: {
        email: updateScoreDto.email,
      },
    });

    if (existingUser) {
      const score = await this.scoreRepo
        .createQueryBuilder('Score')
        .leftJoinAndSelect('Score.user', 'User')
        .leftJoinAndSelect('Score.course', 'Course')
        .where('Score.course.id = :courseId and Score.user.id = :userId', {
          courseId: id_course,
          userId: existingUser.id,
        })
        .getOne();
      if (score) {
        const { final, middle } = updateScoreDto;
        const scoreUpdate = {
          final,
          middle,
        };
        console.log('Update điểm đã có');
        return this.scoreRepo.update(score.id, scoreUpdate);
      } else {
        console.log('Update điểm chưa có');
        const course = await this.courseRepo.findOne({
          where: {
            id: id_course,
          },
        });

        if (course) {
          const score = await this.scoreRepo.save({
            user: existingUser,
            course: course,
            ...updateScoreDto,
          });
          return score;
        } else {
          console.log('Course not found');
          return BadRequestException;
        }
      }
    } else {
      const { firstName, lastName, email, classN } = updateScoreDto;
      const userCreate = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        class: classN,
      };
      await this.userRepo.save(userCreate);
      console.log('Gọi Update điểm chưa có');
      return this.updateDiemSV(id_course, updateScoreDto);
    }
  }
}
