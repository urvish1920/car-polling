import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Rides } from './schemas/rides.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { ValidationError } from 'class-validator';
import { UpdateRideDto } from './dto/update-ride.dto';

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Rides.name)
    private RideModel: mongoose.Model<Rides>,
  ) {}

  async create(createRideDto: CreateRideDto, req): Promise<Rides> {
    try {
      const userId = req.user._id;
      console.log(userId);
      createRideDto.user_id = userId;
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
    passenger: string,
  ): Promise<Rides[]> {
    console.log(from, to, date, passenger);

    const rides = await this.RideModel.aggregate([
      {
        $match: {
          $and: [{ pick_up: from }, { drop_off: to }],
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
    console.log(rides);
    return rides;
  }

  async findOne(id: string): Promise<Rides> {
    try {
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
