import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
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

export class CreateRequestDto {
  @Type(() => LocationDto)
  from: LocationDto;

  @Type(() => LocationDto)
  to: LocationDto;

  @IsString()
  passenger: string;

  user_id: ObjectId;

  Ride_Id: ObjectId;

  @IsString()
  @IsOptional()
  status_Request: string;

  @IsString()
  @IsOptional()
  payment: string;

  @IsString()
  @IsOptional()
  my_status: string;
}
