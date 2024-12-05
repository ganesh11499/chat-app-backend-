import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUser')
  public async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      const result = await this.userService.addUser(createUserDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //Login User
  @Post('logIn')
  public async logIn(@Body() loginDto: LoginDto): Promise<{ message: string }> {
    try {
      const result = await this.userService.logIn(loginDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getAll users
  @Get('filterUsers/:id')
  public async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any[]> {
    try {
      // Call service to fetch users
      return await this.userService.filterUserData(id);
    } catch (error) {
      // Log error and rethrow with a generic message
      console.error('Error in getUserProfile controller:', error);
      throw new InternalServerErrorException('Failed to fetch user profiles.');
    }
  }
}
