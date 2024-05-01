import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/totals')
  @UseGuards(AuthGuard('jwt'))
  async totalCount(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const total = await this.adminService.totalCount(req);
      return res.status(HttpStatus.OK).json(total);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('/AllUser')
  @UseGuards(AuthGuard('jwt'))
  async allUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const user = await this.adminService.AllUser(req);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteUser/:id')
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      await this.adminService.remove(req, id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'delete data successfuly' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteRide/:id')
  async removeRide(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      await this.adminService.removeRide(req, id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'delete data successfuly' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('/AllRides')
  @UseGuards(AuthGuard('jwt'))
  async allRides(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const rides = await this.adminService.AllRides(req);
      return res.status(HttpStatus.OK).json(rides);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/userdetail/:id')
  async userGet(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      console.log(id);
      const User = await this.adminService.GetUser(req, id);
      return res.status(HttpStatus.OK).json(User);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
