import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req['user']['_id'];
      await this.requestService.create(createRequestDto, userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'send request to user' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/notifationUser/:id')
  async notifation(@Param('id') id: string, @Res() res: Response) {
    try {
      const notifation = await this.requestService.notifationUser(id);
      return res.status(HttpStatus.OK).json(notifation);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req['user']['_id'];
      const ridesFind = await this.requestService.findAll(userId);
      return res.status(HttpStatus.OK).json(ridesFind);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const onerides = await this.requestService.findOne(id);
      return res.status(HttpStatus.OK).json(onerides);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Res() res: Response,
  ) {
    try {
      await this.requestService.update(id, updateRequestDto);
      return res.status(HttpStatus.OK).json({ message: 'update successfully' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.requestService.remove(id);
      return res.status(HttpStatus.OK).json({ message: 'request deleted' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
