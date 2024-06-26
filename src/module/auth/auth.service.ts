import {
  ConflictException,
  Inject,
  Injectable,
  Request,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateSignUpDto } from './dto/signup-cart.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from 'src/utils/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUpUser(
    createSignUpDto: CreateSignUpDto,
    @Request() req,
  ): Promise<User> {
    let email = createSignUpDto.email;
    let temporaryUser = await this.userRepository.findOne({ where: { email } });
    if (temporaryUser) {
      throw new ConflictException(
        'Sorry, this email has already been registered.',
      );
    } else {
      const user: User = new User();
      user.firstName = createSignUpDto.firstName;
      user.lastName = createSignUpDto.lastName;
      user.email = createSignUpDto.email;
      const salt = 10;
      const password = createSignUpDto.password;
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
      user.role = createSignUpDto.role;
      if(!user.role) user.role = UserRole.USER;
      await this.userRepository.save(user);
      return user;
    }
  }

  generateToken(payload: CreateUserDto): string {
    return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
  }

  extractAccessToken(req: any): string | null {
    if (req.headers && req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
    }
    return null;
  }
  
  getUserIdFromAccessToken(accessToken: string): number | null {
    try {
      const payload = this.jwtService.verify(accessToken);
      if (payload && payload.id) {
        return payload.id;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
