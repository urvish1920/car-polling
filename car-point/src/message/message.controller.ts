import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './schemas/message.schemas';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<Response> {
    const { chatId, senderId, text } = body;
    try {
      await this.messageService.addMessage(chatId, senderId, text);
      return res.status(HttpStatus.OK).json({ message: 'Message is Sended' });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:chatId')
  async getMessages(@Param('chatId') chatId: string): Promise<Message[]> {
    return await this.messageService.getMessages(chatId);
  }
}
