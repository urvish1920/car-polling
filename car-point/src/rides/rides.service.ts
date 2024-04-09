import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Rides } from './schemas/rides.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ValidationError } from 'class-validator';
import { UpdateRideDto } from './dto/update-ride.dto';
import { vehicle } from 'src/vehicle/schemas/vehicle.schemas';

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Rides.name)
    private RideModel: mongoose.Model<Rides>,
    @InjectModel(vehicle.name)
    private VehicleModel: mongoose.Model<vehicle>,
  ) {}
  async create(createRideDto: CreateRideDto, req): Promise<Rides> {
    try {
      const userId = req.user._id;
      createRideDto.user_id = userId;
      const vehicle = await this.VehicleModel.findById(
        createRideDto.vehicle_id,
      ).exec();

      if (!vehicle) {
        throw new BadRequestException('Vehicle not found');
      }
      createRideDto.leftSites = vehicle.seaters;
      console.log(createRideDto.leftSites);
      const res = await this.RideModel.create(createRideDto);
      return await res.save();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException('Validation failed', error.toString());
      } else {
        throw new InternalServerErrorException(
          'Failed to create ride',
          error.toString(),
        );
      }
    }
  }

  async findAll(
    from: string,
    to: string,
    date: Date,
    passenger: number,
  ): Promise<Rides[]> {
    console.log(from, to, date, passenger);

    const searchDate = new Date(date);
    const searchDateStart = new Date(searchDate);
    searchDateStart.setUTCHours(0, 0, 0, 0);

    console.log(searchDateStart);

    const seatchDateEnd = new Date(searchDate);
    seatchDateEnd.setUTCHours(23, 29, 29, 999);

    console.log(seatchDateEnd);

    const rides = await this.RideModel.aggregate([
      {
        $match: {
          $and: [
            { pick_up: from },
            { drop_off: to },
            { planride_date: { $gte: searchDateStart, $lte: seatchDateEnd } },
            { leftSites: { $gte: passenger } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]).exec();
    return rides;
  }

  async planRidefind(req): Promise<Rides[]> {
    try {
      const userId = req.user._id;
      const currentTime = new Date();
      currentTime.setHours(0, 0, 0, 0);
      console.log(userId);
      const planRide = await this.RideModel.find({
        user_id: userId,
        planride_date: { $gte: currentTime },
      });
      return planRide;
    } catch (error) {
      console.error('Error finding ride:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Rides> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid ride ID');
      }
      const ride = await this.RideModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'vehicles',
            localField: 'vehicle_id',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },
      ]).exec();

      if (ride.length === 0) {
        throw new NotFoundException(`Ride with id ${id} not found`);
      }

      return ride[0];
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid ride ID');
      } else {
        throw error;
      }
    }
  }

  async update(id: string, updateRideDto: UpdateRideDto): Promise<Rides> {
    const updatedRide = await this.RideModel.findByIdAndUpdate(
      id,
      updateRideDto,
      { new: true, runValidators: true },
    );
    if (!updatedRide) {
      throw new NotFoundException(`Ride with id ${id} not found`);
    }
    console.log(`Ride with id ${id} has been successfully updated`);
    return updatedRide;
  }

  async remove(id: string) {
    const deletedRide = await this.RideModel.findByIdAndDelete(id);
    if (deletedRide) {
      return `Ride with id ${id} has been successfully deleted`;
    }
  }
}
