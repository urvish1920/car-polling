import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride_schema } from './schemas/rides.schemas';
import { vehicle_schema } from 'src/vehicle/schemas/vehicle.schemas';
import { Request_schema } from 'src/request/schemas/Request.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Rides', schema: Ride_schema },
      { name: 'vehicle', schema: vehicle_schema },
      { name: 'Request_user', schema: Request_schema },
    ]),
  ],
  controllers: [RidesController],
  providers: [RidesService],
})
export class RidesModule {}
