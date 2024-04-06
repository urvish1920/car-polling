import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { vehicle_schema } from './schemas/vehicle.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'vehicle', schema: vehicle_schema }]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
