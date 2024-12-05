import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from './jwt-service';

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  // Create user service (Type ORM method);
  // public async addUser(createUserDto: CreateUserDto): Promise<any> {
  //   try {
  //     const { userName, email, password } = createUserDto;

  //     //check existing email
  //     const existingUser = await this.entityManager.findOne(User, {
  //       where: { email },
  //     });

  //     if (existingUser) {
  //       return new ConflictException('User already exists!!!');
  //     } else {
  //       //hash password
  //       const saltRounds = 10;
  //       const hashedPassword: string = await bcrypt.hash(password, saltRounds);

  //       // Create a new user instance
  //       const newUser = this.entityManager.create(User, {
  //         userName,
  //         email,
  //         password: hashedPassword, // Store the hashed password
  //       });

  //       // Save the new user
  //       const savedUser = await this.entityManager.save(User, newUser);

  //       return { message: 'User created successfullt' };
  //     }
  //   } catch (error) {
  //     throw new InternalServerErrorException('Internal server error');
  //   }
  // }

  //Create user service (stored procedure);
  public async addUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { userName, email, password } = createUserDto;

      //check existing email
      const existingUser = await this.entityManager.findOne(User, {
        where: { email },
      });

      if (existingUser) {
        return new ConflictException('User already exits!!!');
      } else {
        //hash password
        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        //sql query
        const query: string = 'CALL addUserProcedure(?,?,?,?)';
        const params: any[] = [userName, email, hashedPassword, new Date()];

        await this.entityManager.query(query, params);

        return { message: 'User created successfully' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  //Login user service
  public async logIn(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;

      //Sql query for email
      const query: string = 'SELECT * FROM user WHERE email = ?';

      const params: any[] = [email];

      const users: any[] = await this.entityManager.query(query, params);
      const user = users[0];
      //check if user exists
      if (!user) {
        return new UnauthorizedException('Invalid email');
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return new UnauthorizedException('Invalid credentials');
        } else {
          const token = this.jwtService.generateToken(user);

          return { id: user.id, name: user.userName, email: user.email, token };
        }
      }
    } catch (error) {
      return new InternalServerErrorException('Internal server error');
    }
  }

  //get all users service

  public async filterUserData(id: number): Promise<any[]> {
    try {
      //Sql query
      const query: string = 'SELECT * FROM user where id !=?';
      
      //execute query
      return await this.entityManager.query(query, [id]);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
