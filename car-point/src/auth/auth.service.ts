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
import * as nodemailer from 'nodemailer';
import { Request } from 'express';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto): Promise<void> {
    const { user_name, email, password } = signupAuthDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      user_name,
      email,
      password: hashedPassword,
    });
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
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    usersignupdto: UpdateSignupDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const img = await this.UploadUserImage(file, id);
    await this.userModel.findByIdAndUpdate(id, {
      ...usersignupdto,
      image: img,
    });
  }

  async UploadUserImage(
    file: Express.Multer.File,
    id: string,
  ): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${id}`);
    const img = await uploadBytesResumable(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(img.ref);
    return downloadURL;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User Not Exists!!');
    }
    const token = this.jwtService.sign(
      { id: user._id },
      {
        expiresIn: '5m',
      },
    );
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
    console.log(link);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'urvishpatel192011@gmail.com',
        pass: 'tttdeqeyzlkhskol',
      },
    });

    const mailOptions = {
      from: 'urvishpatel192011@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error sending email:', error);
        throw new Error('Failed to send email');
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
}
