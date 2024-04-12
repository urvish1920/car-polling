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
  UploadedFile,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSignupDto } from './dto/updatesignup-auth.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniquename = Date.now() + extname(file.originalname);
    cb(null, uniquename);
  },
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  Signup(@Body() signupAuthDto: SignupAuthDto): Promise<string> {
    return this.authService.signup(signupAuthDto);
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
  findOne(@Req() req: Request) {
    return this.authService.findOne(req);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadedFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { filename: file.filename };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateUser/:id')
  update(@Param('id') id: string, @Body() UpdateSignupDto: UpdateSignupDto) {
    return this.authService.updateUser(id, UpdateSignupDto);
  }
}
