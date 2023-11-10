import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    return await this.courseRepo.save(createCourseDto);
  }

  async getall() {
    return await this.courseRepo.find({
      where: {
        isDel: 0,
      },
    });
  }
  async findAll(search: string) {
    return await this.courseRepo.findBy({ name: ILike(`%${search}%`) });
  }

  async findOne(id: number): Promise<Course> {
    return await this.courseRepo.findOne({ where: { id } });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return await this.courseRepo.update(id, updateCourseDto);
  }

  async remove(id: number) {
    try {
      const hp = await this.courseRepo.findOne({
        where: {
          id: id,
        },
      });

      if (hp) {
        hp.isDel = 1;
        const updatedHp = await this.courseRepo.update(id, hp);
        if (updatedHp) {
          return updatedHp;
        } else {
          throw new Error('Update failed');
        }
      } else {
        throw new Error('Course not found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
