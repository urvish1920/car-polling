import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Request_user } from './schemas/Request.schemas';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request_user.name)
    private Request_user: mongoose.Model<Request_user>,
  ) {}

  async create(
    createRequestDto: CreateRequestDto,
    userId,
  ): Promise<Request_user> {
    createRequestDto.user_id = userId;
    const res = await this.Request_user.create(createRequestDto);
    return await res.save();
  }

  async notifationUser(id: string): Promise<Request_user[]> {
    if (!id) {
      throw new NotFoundException(`Ride with id ${id} not found`);
    }
    const objectId = new mongoose.Types.ObjectId(id);
    const pendingRequests = await this.Request_user.aggregate([
      {
        $match: {
          $and: [
            { Ride_Id: objectId },
            { status_Request: 'Awaiting Approval' },
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
    ]);
    console.log(pendingRequests);
    return pendingRequests;
  }

  async findAll(userId): Promise<Request_user[]> {
    const Request_user = await this.Request_user.aggregate([
      {
        $match: {
          user_id: userId,
        },
      },
      {
        $lookup: {
          from: 'rides',
          localField: 'Ride_Id',
          foreignField: '_id',
          as: 'ride',
        },
      },
      {
        $unwind: '$ride',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ride.user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]).exec();
    return Request_user;
  }

  async findOne(id: string): Promise<Request_user[]> {
    const user = await this.Request_user.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'rides',
          localField: 'Ride_Id',
          foreignField: '_id',
          as: 'ride',
        },
      },
      {
        $unwind: '$ride',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ride.user_id',
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
          localField: 'ride.vehicle_id',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      {
        $unwind: '$vehicle',
      },
    ]).exec();
    return user;
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
  ): Promise<Request_user> {
    const updatedRequestUser = await this.Request_user.findByIdAndUpdate(
      id,
      updateRequestDto,
      { new: true, runValidators: true },
    );
    if (!updatedRequestUser) {
      throw new NotFoundException(`user Request with id ${id} not found`);
    }
    return updatedRequestUser;
  }

  async remove(id: string) {
    const deletedRequest = await this.Request_user.findByIdAndDelete(id);
    if (deletedRequest) {
      return `Request user with id ${id} has been successfully deleted`;
    }
  }
}
