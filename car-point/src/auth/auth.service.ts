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
import mongoose, { Model } from 'mongoose';
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
import { Rides } from 'src/rides/schemas/rides.schemas';
import { Request_user } from 'src/request/schemas/Request.schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Rides.name)
    private RideModel: mongoose.Model<Rides>,
    @InjectModel(Request_user.name)
    private Request_user: mongoose.Model<Request_user>,
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

  async signIn(loginDto: SignInDto): Promise<{ token: string; user: User }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({ id: user._id });
      return { token, user };
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
  async findOneId(id: string): Promise<User> {
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
  ): Promise<{ img: string }> {
    const img = await this.UploadUserImage(file, id);
    await this.userModel.findByIdAndUpdate(id, {
      ...usersignupdto,
      image: img,
    });
    console.log(id);
    const update = await this.RideModel.updateMany(
      { 'occupation.user._id': id },
      { $set: { 'occupation.$.user.image': img } },
      { new: true, runValidators: true },
    );
    console.log(update);
    return { img };
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
    const link = `http://localhost:3000/emailsend/${user._id}/${token}`;
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

  async verifyUser(
    id: string,
    token: string,
  ): Promise<{ userId: string; message: string }> {
    console.log('ID:', id);
    console.log('Token:', token);
    try {
      const decodedToken = this.jwtService.verify(token);
      console.log('Decoded Token:', decodedToken);

      const { id: tokenUserId } = decodedToken;
      console.log('Token User ID:', tokenUserId);

      const user = await this.userModel.findById(tokenUserId);

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { userId: tokenUserId, message: 'User is verified' };
    } catch (error) {
      console.error('Error verifying user:', error.message);
      throw new Error(`Error verifying user: ${error.message}`);
    }
  }

  async ResetPassword(newPassword: string, userId: string): Promise<void> {
    console.log(newPassword, userId);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
  }
}
