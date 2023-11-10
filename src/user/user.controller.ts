import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDto, CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllSv(@Query() query: any) {
    return await this.userService.getAll(query.search);
  }

  @Get('/masv/:msv')
  async getSVbyMsv(@Param('msv') msv: string) {
    return await this.userService.getSvbyMsv(msv);
  }

  // @Get()
  // async getSVbyName(@Body() student_name: string) {
  //   return await this.userService.getbyName(student_name);
  // }

  @Post('/login')
  async loginCredentials(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @Post('/sinh-vien')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createSv(createUserDto);
  }

  @Patch('/:msv')
  patchSv(@Body() createUserDto: CreateUserDto) {
    return this.userService.patchSv(createUserDto);
  }

  @Delete('/:id')
  deleteSv(@Param('id') id: number) {
    return this.userService.deleteSv(id);
  }
}
