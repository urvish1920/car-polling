import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/auth.schemas';
import { Rides } from 'src/rides/schemas/rides.schemas';
import { Request_user } from 'src/request/schemas/Request.schemas';
import mongoose from 'mongoose';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Rides.name)
    private RideModel: mongoose.Model<Rides>,
    @InjectModel(Request_user.name)
    private Request_user: mongoose.Model<Request_user>,
  ) {}

  async totalCount(req: Request): Promise<{
    totalUsers: number;
    totalRides: number;
    totalRequests: number;
  }> {
    console.log(req['user']['IsAdmin']);
    if (req['user']['IsAdmin']) {
      const totalUsers = await this.userModel.countDocuments();
      const totalRides = await this.RideModel.countDocuments();
      const totalRequests = await this.Request_user.countDocuments();
      return {
        totalUsers,
        totalRides,
        totalRequests,
      };
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async AllUser(req: Request): Promise<{ AllUsers: any[] }> {
    const { page = '1', pageSize = '5' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    console.log(parsedPage);
    const parsedPageSize = parseInt(pageSize as string, 10);
    console.log(parsedPageSize);
    const skip = (parsedPage - 1) * parsedPageSize;
    console.log(skip);
    if (req['user']['IsAdmin']) {
      const allUsers = await this.userModel.aggregate([
        {
          $skip: skip,
        },
        {
          $limit: parsedPageSize,
        },
        {
          $lookup: {
            from: 'rides',
            localField: '_id',
            foreignField: 'user_id',
            as: 'rides',
          },
        },
        {
          $lookup: {
            from: 'request_users',
            localField: '_id',
            foreignField: 'user_id',
            as: 'requests',
          },
        },
        {
          $project: {
            _id: 1,
            user_name: 1,
            email: 1,
            image: 1,
            ridesCount: { $size: '$rides' },
            requestsCount: { $size: '$requests' },
          },
        },
      ]);
      return { AllUsers: allUsers };
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }

  async remove(req: Request, id: string) {
    if (req['user']['IsAdmin']) {
      const deleteRequest = await this.Request_user.deleteMany({ user_id: id });
      const deleteRide = await this.RideModel.deleteMany({ user_id: id });
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (deleteRequest && deleteRide && deletedUser) {
        return `userid ${id} has been successfully deleted`;
      } else {
        throw new NotFoundException(`user with this id ${id} not found`);
      }
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async AllRides(req: Request): Promise<{ AllRides: Rides[] }> {
    const { page = '1', pageSize = '5' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    console.log(parsedPage);
    const parsedPageSize = parseInt(pageSize as string, 10);
    console.log(parsedPageSize);
    const skip = (parsedPage - 1) * parsedPageSize;
    console.log(skip);
    if (req['user']['IsAdmin']) {
      const allRides = await this.RideModel.aggregate([
        {
          $skip: skip,
        },
        {
          $limit: parsedPageSize,
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
      return { AllRides: allRides };
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }

  async removeRide(req: Request, id: string) {
    console.log(id);
    if (req['user']['IsAdmin']) {
      const deleteRequest = await this.Request_user.deleteMany({
        Ride_Id: new mongoose.Types.ObjectId(id),
      });
      const deleteRide = await this.RideModel.findByIdAndDelete({ _id: id });
      if (deleteRequest && deleteRide) {
        return `ride ${id} has been successfully deleted`;
      } else {
        throw new NotFoundException(`ride with this id ${id} not found`);
      }
    } else {
      throw new UnauthorizedException('Not proper User');
    }
  }
}
