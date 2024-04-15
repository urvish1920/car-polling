import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Rides } from './schemas/rides.schemas';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createRideDto: CreateRideDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.ridesService.create(createRideDto, req);
      return res.status(HttpStatus.OK).json({ message: 'Ride is created' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('/filterData')
  async findAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: Date,
    @Query('passanger') passanger: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const rides = await this.ridesService.findAll(from, to, date, +passanger);
      return res.status(HttpStatus.OK).json(rides);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/planRide')
  async planRidefind(@Req() req: Request, @Res() res: Response) {
    try {
      const PlanRides = await this.ridesService.planRidefind(req);
      return res.status(HttpStatus.OK).json(PlanRides);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const oneRides = await this.ridesService.findOne(id);
      return res.status(HttpStatus.OK).json(oneRides);
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
    @Body() updateRideDto: UpdateRideDto,
    @Res() res: Response,
  ) {
    try {
      await this.ridesService.update(id, updateRideDto);
      return res.status(HttpStatus.OK).json({ message: 'ride is updated' });
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
      await this.ridesService.remove(id);
      return res.status(HttpStatus.OK).json({ message: 'ride Deleted' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
