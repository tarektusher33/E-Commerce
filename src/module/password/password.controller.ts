import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordEntityDto } from './entities/password.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private mailerService: MailerService,
    private userService : UsersService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const token = Math.random().toString(20).substr(2, 12);
    await this.passwordService.forgotPassword({ email, token });

    const url = `http://localhost:3000/reset/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your Password',
      html: `Your OTP Code is : ${token}`,
    });

    return {
      message: 'Please check your email',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
  ) {
    const { token, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new BadRequestException('Password do not match');
    }
    const passwordReset : PasswordEntityDto = await this.passwordService.findToken(token);
    const user = await this.userService.getUserByEmail(passwordReset.email);

    if(!user){
      throw new NotFoundException('User not found!');
    }
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    await this.userService.updatePassword(user.id, {password : hashPassword});
    return {
      message : "Password update successfully"
    }
  }
}
