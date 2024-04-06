import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request_schema } from './schemas/Request.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Request_user', schema: Request_schema },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
