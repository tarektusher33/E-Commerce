import { Inject, Injectable, Request, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateSignUpDto } from './dto/signup-cart.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService : UsersService,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ) {}

  async signUpUser(
    createSignUpDto : CreateSignUpDto,
    @Request() req,
  ): Promise<User | string> {
    let email = createSignUpDto.email;
    let temporaryUser = await this.userRepository.findOne({ where: { email } });
    if (temporaryUser) {
      return 'Sorry, this email has already been registered.';
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
      await this.userRepository.save(user);
      return user;
    }
  }

  generateToken(payload: CreateUserDto): string {
    return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
  }

  extractAccessToken(req : any): string | null {
    
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
