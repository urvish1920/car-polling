import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { vehicle } from './schemas/vehicle.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Request } from 'express';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(vehicle.name)
    private VehicleModel: mongoose.Model<vehicle>,
  ) {}

  async create(
    createVehicleDto: CreateVehicleDto,
    req: Request,
  ): Promise<vehicle> {
    const userId = req['user']['_id'];
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }
    createVehicleDto.user_id = userId;
    const res = await this.VehicleModel.create(createVehicleDto);
    return await res.save();
  }

  async findAll(req: Request): Promise<vehicle[]> {
    const userId = req['user']['_id'];
    const vehicles = await this.VehicleModel.find({ user_id: userId }).exec();
    if (!vehicles) {
      throw new NotFoundException(`vehicle not found`);
    }
    return vehicles;
  }

  async findOne(id: string) {
    const ride = await this.VehicleModel.findById(id);
    if (!ride) {
      throw new NotFoundException(`vehicle with id ${id} not found`);
    }
    return ride;
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
      return `Ride with id ${id} has been successfully deleted`;
    } else {
      throw new NotFoundException(`Ride with id ${id} not found`);
    }
  }
}
