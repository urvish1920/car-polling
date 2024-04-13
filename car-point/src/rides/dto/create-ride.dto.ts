import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

export class LocationDto {
  @IsString()
  city: string;

  @IsString()
  fullAddress: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateRideDto {
  @IsString({ message: 'vehicle id is string' })
  vehicle_id: string;

  user_id: ObjectId;

  @Type(() => LocationDto)
  pick_up: LocationDto;

  @Type(() => LocationDto)
  drop_off: LocationDto;

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
