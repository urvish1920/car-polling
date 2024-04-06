import { IsNumber, IsString } from "class-validator";

export class CreateRequestDto {
  @IsString({ message: 'name is required' })
  from: string;

  @IsString({ message: 'Number plate is required' })
  to: string;

  @IsString({ message: 'car model is required' })
  user_id: string;

  @IsNumber({}, { message: 'seaters is required' })
  Ride_Id: string;

  @IsString({ message: 'color of is required' })
  color: string;

  @IsString()
  status_Request: string;

  @IsString()
  payment: string;

  @IsString()
  my_status: string;
}
