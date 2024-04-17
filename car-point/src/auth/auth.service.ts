import {
  Injectable,
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
import { UpdateSignupDto } from './dto/updatesignup-auth.dto';
import { Request } from 'express';
import { getDownloadURL, getStorage , ref, uploadBytesResumable } from "firebase/storage";
import { promises } from 'dns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto): Promise<string> {
    const { user_name, email, password } = signupAuthDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      user_name,
      email,
      password: hashedPassword,
    });
    return 'signup Successfully';
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

  async findOne(req: Request): Promise<User> {
    const id = req['user']['_id'];
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`vehicle with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, usersignupdto: UpdateSignupDto ,file:Express.Multer.File){
      const img = await this.UploadUserImage(file,id);
      const updatedRide = await this.userModel.findByIdAndUpdate(
        id,
        {
          usersignupdto,
          image:img
        }
      );
      if (!updatedRide) {
        throw new NotFoundException(`Ride with Id ${id} not found`);
      }
      return "user update successfully";
  }

  async UploadUserImage(file : Express.Multer.File, id :  string)
  {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${id}`);
    const  img = await uploadBytesResumable(storageRef, file.buffer)
    const downloadURL = await getDownloadURL(img.ref);
       return downloadURL;
  }
}
