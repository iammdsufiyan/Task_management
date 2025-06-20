import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
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

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: jwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      console.log(accessToken);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login credential ');
    }
  }
}

// 6b076cb0e3f9c7bd05f3974601ebc708a9161c6daee97f44d2a1243cfe9468f5
// 6b076cb0e3f9c7bd05f3974601ebc708a9161c6daee97f44d2a1243cfe9468f5
