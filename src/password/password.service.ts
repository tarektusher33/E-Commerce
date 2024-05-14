import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntityDto } from './entities/password.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(PasswordEntityDto)
    private readonly passwordRepository: Repository<PasswordEntityDto>,
  ) {}


  async forgotPassword (body : any) {
    return this.passwordRepository.save(body);
  }

  async findToken(token : string){
    return this.passwordRepository.findOne({ where: { token } });
  }
}
