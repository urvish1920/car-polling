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
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.vehicleService.create(createVehicleDto, req);
      return res.status(HttpStatus.OK).json({ message: 'Ride is created' });
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
      const vehicle = await this.vehicleService.findAll(req);
      return res.status(HttpStatus.OK).json(vehicle);
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
      const vehicleOne = await this.vehicleService.findOne(id);
      return res.status(HttpStatus.OK).json(vehicleOne);
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
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Res() res: Response,
  ) {
    try {
      this.vehicleService.update(id, updateVehicleDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'update data successfuly' });
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
      await this.vehicleService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'delete data successfuly' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
