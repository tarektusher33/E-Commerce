import { Injectable } from '@nestjs/common';
import { User } from './dto/user.dto';

@Injectable()
export class UserService {
  public users: User[] = [
    {
      userName: 'Tarek',
      password: '1234',
      email: 'tarek@gmail.com',
    },
    {
      userName: 'Tusher',
      password: '1234',
      email: 'tusher@gmail.com',
    },
  ];

  getUserByUserName(userName: string): User {
    return this.users.find((user) => user.userName == userName);
  }
}
