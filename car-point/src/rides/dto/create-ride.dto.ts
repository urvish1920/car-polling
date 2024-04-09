import { IsString, IsNumber, IsDate } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateRideDto {
  vehicle_id: ObjectId;
  user_id: ObjectId;

  @IsString({ message: 'pick_up is string' })
  pick_up: string;

  @IsString({ message: 'drop_off is string' })
  drop_off: string;

  // @IsDate({ message: 'drop_off is date' })
  // planride_date: Date;

  @IsString({ message: 'start_time is string' })
  start_time: string;

  @IsString({ message: 'end_time is string' })
  end_time: string;

  @IsNumber({}, { message: 'Price is number' })
  price: number;

  occupation: [] = [];

  ride_status: string;

  notemore: string;

  leftSites: number;
}
