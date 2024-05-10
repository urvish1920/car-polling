import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ namespace: 'message', cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService: MessageService) {}

  handleConnection(socket: Socket) {
    // console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    // console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(client: Socket, data: any) {
    const { senderId, chatId, text } = data;
    console.log('Sending from socket to:', senderId);
    console.log('Data:', data);
    const newData = await this.messageService.addMessage(
      chatId,
      senderId,
      text,
    );
    this.server.emit('recieve-message', newData);
  }
}
