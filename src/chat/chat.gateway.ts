import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Update with your frontend URL in production
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedUsers = new Map<string, Socket>();
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      for (const [userId, socket] of this.connectedUsers.entries()) {
        if (socket.id === client.id) {
          this.connectedUsers.delete(userId);
          break;
        }
      }
    }
  
    @SubscribeMessage('register')
    handleRegister(client: Socket, userId: string) {
      this.connectedUsers.set(userId, client);
      console.log(`User registered: ${userId}`);
    }
  
    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: { senderId: string; receiverId: string; content: string }) {
      const receiverSocket = this.connectedUsers.get(payload.receiverId);
  
      if (receiverSocket) {
        receiverSocket.emit('receiveMessage', payload);
      }
    }
  }
  