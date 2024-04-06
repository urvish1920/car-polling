import { IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateVehicleDto {
  user_id: ObjectId;

  @IsString({ message: 'name is required' })
  name: string;

  @IsString({ message: 'Number plate is required' })
  No_Plate: string;

  @IsString({ message: 'car model is required' })
  model: string;

  @IsNumber({}, { message: 'seaters is required' })
  seaters: number;

  @IsString({ message: 'color of is required' })
  color: string;
}
