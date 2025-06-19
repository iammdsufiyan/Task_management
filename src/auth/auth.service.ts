import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('salt', salt);
    console.log('hashedPassword', hashedPassword);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }
}

// 6b076cb0e3f9c7bd05f3974601ebc708a9161c6daee97f44d2a1243cfe9468f5
// 6b076cb0e3f9c7bd05f3974601ebc708a9161c6daee97f44d2a1243cfe9468f5
