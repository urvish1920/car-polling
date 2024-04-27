import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { User_schema } from 'src/auth/schemas/auth.schemas';
import { Ride_schema } from 'src/rides/schemas/rides.schemas';
import { Request_schema } from 'src/request/schemas/Request.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: User_schema },
      { name: 'Rides', schema: Ride_schema },
      { name: 'Request_user', schema: Request_schema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
