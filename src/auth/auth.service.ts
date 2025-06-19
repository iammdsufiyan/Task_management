import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { promises } from 'dns';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  //   async createUser(authCredentialDto:AuthCredentialDto):Promise<void>{
  //     const { username ,password} = authCredentialDto
  //     const user = this.createUser({username,password});
  //         await this.save(user);
  //     }

//   async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
//     const { username, password } = authCredentialDto;
//     const user = this.create({ username, password });
//     await this.save(user);
//   }
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;
    const user = this.userRepository.create({ username, password });
    await this.userRepository.save(user);
  }
}
