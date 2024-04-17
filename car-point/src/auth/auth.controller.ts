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
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSignupDto } from './dto/updatesignup-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async Signup(@Body() signupAuthDto: SignupAuthDto, @Res() res: Response) {
    try {
      this.authService.signup(signupAuthDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'delete data successfuly' });
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
    const access_token = await this.authService.signIn(loginDto);
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 365 * 24 * 60 * 1000),
        domain: 'localhost',
      })
      .send({ status: 'ok', access_token });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getuser')
  async findOne(@Req() req: Request, @Res() res: Response) {
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
  @Patch('/updateUser/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() usersignupdto: UpdateSignupDto,
    @Param('id') id: string,
    @Res() res: Response,
  ){
    try {
      await this.authService.updateUser(id, usersignupdto,file);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'user Update successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
