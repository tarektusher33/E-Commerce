import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async findOne(id: number) {
    let user = await this.userRepository.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    userToUpdate.firstName = updateUserDto.firstName;
    userToUpdate.lastName = updateUserDto.lastName;
    if (updateUserDto.password) {
      const salt = 10;
      const hashPassword = await bcrypt.hash(updateUserDto.password, salt);
      userToUpdate.password = hashPassword;
    }
    userToUpdate.role = updateUserDto.role;
    const updatedUser = await this.userRepository.save(userToUpdate);
    return updatedUser;
  }

  async updatePassword(id: number, data: any): Promise<any> {
    return this.userRepository.update(id, data);
  }
}
