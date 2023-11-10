import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { ScoreModule } from './score/score.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HocphanModule } from './hocphan/hocphan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'qlsv',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    CourseModule,
    ScoreModule,
    HocphanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
