import { Inject, Injectable, Request, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
    @Request() req,
  ): Promise<User | string> {
    let email = createUserDto.email;
    let temporaryUser = await this.userRepository.findOne({ where: { email } });
    if (temporaryUser) {
      return 'Sorry, this email has already been registered.';
    } else {
      const user: User = new User();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.email = createUserDto.email;
      const salt = 10;
      const password = createUserDto.password;
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
      await this.userRepository.save(user);
      return user;
    }
  }
  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    } else return user;
  }
  
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(id);
    let userToUpdate: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!userToUpdate) {
      throw new Error('User not found');
    }
    userToUpdate.firstName = updateUserDto.firstName;
    userToUpdate.lastName = updateUserDto.lastName;
    userToUpdate.email = updateUserDto.email;
    const salt = 10;
    const password = updateUserDto.password;
    const hashPassword = await bcrypt.hash(password, salt);
    userToUpdate.password = hashPassword;
    const updatedUser = await this.userRepository.save(userToUpdate);
    return updatedUser;
  }

  async deleteUser(id: number) {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    } else {
      this.userRepository.delete(id);
      return 'User successfully deleted';
    }
  }
}
