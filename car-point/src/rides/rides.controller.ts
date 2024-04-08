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
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Rides } from './schemas/rides.schemas';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createRideDto: CreateRideDto, @Req() req: Request) {
    return this.ridesService.create(createRideDto, req);
  }

  @Get('/filterData')
  async findAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: Date,
    @Query('passanger') passanger: string,
  ): Promise<Rides[]> {
    return this.ridesService.findAll(from, to, date, +passanger);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/planRide')
  async planRidefind(@Req() req: Request) {
    return this.ridesService.planRidefind(req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ridesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.ridesService.update(id, updateRideDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridesService.remove(id);
  }
}
