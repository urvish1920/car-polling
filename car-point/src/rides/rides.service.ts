import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Rides } from './schemas/rides.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Request } from 'express';
import { UpdateRideDto } from './dto/update-ride.dto';
import { vehicle } from 'src/vehicle/schemas/vehicle.schemas';
import { Request_user } from 'src/request/schemas/Request.schemas';

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Rides.name)
    private RideModel: mongoose.Model<Rides>,
    @InjectModel(vehicle.name)
    private VehicleModel: mongoose.Model<vehicle>,
    @InjectModel(Request_user.name)
    private Request_user: mongoose.Model<Request_user>,
  ) {}

  async create(createRideDto: CreateRideDto, req): Promise<Rides> {
    const userId = req.user?._id;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    createRideDto.user_id = userId;
    const vehicle = await this.VehicleModel.findById(createRideDto.vehicle_id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    createRideDto.leftSites = vehicle.seaters;
    const res = await this.RideModel.create(createRideDto);
    return await res.save();
  }

  async findAll(
    from: string,
    to: string,
    date: Date,
    passenger: number,
  ): Promise<any> {
    const fromPlace = JSON.parse(from);
    const toPlace = JSON.parse(to);
    const searchDate = new Date(date);
    const searchDateStart = new Date(searchDate);
    searchDateStart.setUTCHours(0, 0, 0, 0);
    const searchDateEnd = new Date(searchDate);
    searchDateEnd.setUTCHours(23, 59, 59, 999);
    console.log(fromPlace, toPlace, searchDateStart, searchDateEnd, passenger);

    const rides = await this.RideModel.aggregate([
      {
        $match: {
          $and: [
            { 'pick_up.city': fromPlace.city },
            { 'drop_off.city': toPlace.city },
            { planride_date: { $gte: searchDateStart, $lte: searchDateEnd } },
            { leftSites: { $gte: passenger } },
            { ride_status: { $ne: 'completed' } },
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
    console.log(rides);

    if (rides.length === 0) {
      return { message: 'Rides not found' };
    }
    return { rides };
  }

  async planRidefind(req: Request): Promise<Rides[]> {
    const userId = req['user']['_id'];
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    const currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);

    const planRide = await this.RideModel.find({
      user_id: userId,
      planride_date: { $gte: currentTime },
    });
    return planRide;
  }

  async findOne(id: string): Promise<Rides> {
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
  }

  async update(id: string, updateRideDto: UpdateRideDto): Promise<Rides> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ride ID');
    }
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

  async remove(ride_id: string, request_id: string) {
    const res = await this.Request_user.findByIdAndUpdate(
      { _id: request_id },
      {
        status_Request: 'cancel',
        my_status: 'cancel',
      },
    );

    await this.RideModel.updateOne(
      { _id: new mongoose.Types.ObjectId(ride_id) },
      {
        $pull: { occupation: { _id: request_id } },
        $inc: { leftSites: Number(res.passenger) },
      },
      { new: true, runValidators: true },
    );
  }
}
