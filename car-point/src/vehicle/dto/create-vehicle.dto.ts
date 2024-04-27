import { IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateVehicleDto {
  user_id: ObjectId;

  @IsString({ message: 'name is String' })
  name: string;

  @IsString({ message: 'Number plate is string' })
  No_Plate: string;

  @IsString({ message: 'car model is string' })
  model: string;

  @IsString({ message: 'seaters is string' })
  seaters: string;

  @IsString({ message: 'color of is string' })
  color: string;
}
