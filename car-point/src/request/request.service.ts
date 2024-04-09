import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Request_user } from './schemas/Request.schemas';
import { ValidationError } from 'class-validator';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request_user.name)
    private Request_user: mongoose.Model<Request_user>,
  ) {}

  async create(createRequestDto: CreateRequestDto, req): Promise<Request_user> {
    try {
      const userId = req.user._id;
      createRequestDto.user_id = userId;
      const res = await this.Request_user.create(createRequestDto);
      return await res.save();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException('Validation failed', error.toString());
      } else {
        throw new InternalServerErrorException(
          'Failed to create request',
          error.toString(),
        );
      }
    }
  }

  async notifationUser(id: string): Promise<Request_user[]> {
    try {
      if (!id) {
        throw new NotFoundException(`Ride with id ${id} not found`);
      }
      console.log(id);
      const objectId = new mongoose.Types.ObjectId(id);
      console.log(objectId);
      const pendingRequests = await this.Request_user.aggregate([
        {
          $match: {
            $and: [{ Ride_Id: objectId }, { status_Request: 'pending' }],
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
    } catch (error) {
      console.error('Error finding ride:', error);
      throw error;
    }
  }

  async findAll(): Promise<Request_user[]> {
    const Request_user = await this.Request_user.find().exec();
    return Request_user;
  }

  async findOne(id: string): Promise<Request_user> {
    try {
      const userRequest = await this.Request_user.findById(id);
      if (!userRequest) {
        throw new NotFoundException(`user request with id ${id} not found`);
      }
      return userRequest;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid user Request ID');
      } else {
        throw error;
      }
    }
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
  ): Promise<Request_user> {
    try {
      const updatedRequestUser = await this.Request_user.findByIdAndUpdate(
        id,
        updateRequestDto,
        { new: true, runValidators: true },
      );
      if (!updatedRequestUser) {
        throw new NotFoundException(`user Request with id ${id} not found`);
      }
      console.log(`user request with id ${id} has been successfully updated`);
      return updatedRequestUser;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const deletedRequest = await this.Request_user.findByIdAndDelete(id);
    if (deletedRequest) {
      return `Request user with id ${id} has been successfully deleted`;
    }
  }
}
