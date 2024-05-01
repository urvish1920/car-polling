import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  Patch,
  UseInterceptors,
  Param,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSignupDto } from './dto/updatesignup-auth.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async Signup(
    @Body() signupAuthDto: SignupAuthDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.authService.signup(signupAuthDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User created successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('/signIn')
  async signIn(
    @Body() loginDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { token, user } = await this.authService.signIn(loginDto);
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 365 * 24 * 60 * 1000),
        domain: 'localhost',
      })
      .send({ status: 'ok', access_token: token, user });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getuser')
  async findOne(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const user = await this.authService.findOne(req);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  async findOneId(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.authService.findOneId(id);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateUser/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() usersignupdto: UpdateSignupDto,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      console.log(file, id, UpdateSignupDto);
      const image = await this.authService.updateUser(id, usersignupdto, file);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User Image upload successfully', image });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('/changePassword')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req['user']['_id'];
    try {
      await this.authService.changePassword(userId, changePasswordDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User password changed successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('/logout')
  async logout(@Res() res: Response): Promise<Response> {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        domain: 'localhost',
      });
      return res.send('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Logout failed');
    }
  }

  @Post('/sendResetPasswordEmail')
  async sendResetPasswordEmail(
    @Body('email') email: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.authService.sendResetPasswordEmail(email);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Reset password email sent successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('/userverify/:id/:token')
  async verifyUser(
    @Param('id') id: string,
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { userId, message } = await this.authService.verifyUser(id, token);
      return res.status(HttpStatus.OK).json({ userId, message });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Patch('/resetPassword/:userId')
  async resetPassword(
    @Body('newPassword') newPassword: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.authService.ResetPassword(newPassword, userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Reset password successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
