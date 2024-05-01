import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chatId: string;
  @IsString()
  senderId: string;
  text: string;
}
