import { IsString, IsNumber, IsDate } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateRideDto {
  @IsString({ message: 'vehicle id is string' })
  vehicle_id: string;

  user_id: ObjectId;

  @IsString({ message: 'pick_up is string' })
  pick_up: string;

  @IsString({ message: 'drop_off is string' })
  drop_off: string;

  @IsString({ message: 'planride_date is date' })
  planride_date: Date;

  @IsString({ message: 'start_time is string' })
  start_time: string;

  @IsString({ message: 'end_time is string' })
  end_time: string;

  @IsNumber({}, { message: 'Price is number' })
  price: number;

  occupation: [] = [];

  ride_status: string;

  leftSites: number;
}
