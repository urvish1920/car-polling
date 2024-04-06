import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { vehicle } from './schemas/vehicle.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ValidationError } from 'class-validator';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(vehicle.name)
    private VehicleModel: mongoose.Model<vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<vehicle> {
    try {
      const res = await this.VehicleModel.create(createVehicleDto);
      return await res.save();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException('Validation failed', error.toString());
      } else {
        throw new InternalServerErrorException(
          'Failed to create vehicle model',
          error.toString(),
        );
      }
    }
  }

  async findAll(): Promise<vehicle[]> {
    const vehicle = await this.VehicleModel.find().exec();
    return vehicle;
  }

  async findOne(id: string) {
    try {
      const ride = await this.VehicleModel.findById(id);
      if (!ride) {
        throw new NotFoundException(`vehicle with id ${id} not found`);
      }
      return ride;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid vehicle ID');
      } else {
        throw error;
      }
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const updatedvehicle = await this.VehicleModel.findByIdAndUpdate(
      id,
      updateVehicleDto,
      { new: true, runValidators: true },
    );
    if (!updatedvehicle) {
      throw new NotFoundException(`vehicle with id ${id} not found`);
    }
    console.log(`vehicle with id ${id} has been successfully updated`);
    return updatedvehicle;
  }

  async remove(id: string) {
    const deletedvehicle = await this.VehicleModel.findByIdAndDelete(id);
    if (deletedvehicle) {
      return `vehicle with id ${id} has been successfully deleted`;
    }
  }
}
