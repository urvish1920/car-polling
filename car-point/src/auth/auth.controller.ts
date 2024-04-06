import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';
import { Response } from 'express';
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
}
