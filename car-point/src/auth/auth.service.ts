import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/auth.schemas';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto): Promise<string> {
    try {
      const { user_name, email, password } = signupAuthDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.create({
        user_name,
        email,
        password: hashedPassword,
      });
      return 'signup Successfully';
    } catch (error) {
      console.log(error.code);
      if (error.code == '11000') {
        throw new ConflictException('Duplicate data input');
      } else {
        throw new InternalServerErrorException(
          'Failed to create vehicle model',
          error.toString(),
        );
      }
    }
  }

  async signIn(loginDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async findOne(req) {
    try {
      const id = req.user._id;
      console.log(id);
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`vehicle with id ${id} not found`);
      }
      console.log(user + 'hyyy');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid vehicle ID');
      } else {
        throw error;
      }
    }
  }
}
