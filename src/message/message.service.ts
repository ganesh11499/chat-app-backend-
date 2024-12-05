import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Server } from 'socket.io';

@Injectable()
export class MessageService {
  private io: Server; // Socket.IO server instance

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // Setter for the Socket.IO server instance
  setSocketServer(io: Server) {
    this.io = io;
  }

  // Save a message and notify the recipient
  public async createMessage(message: Partial<Message>): Promise<Message> {
    try {
      const savedMessage = await this.messageRepository.save(message);

      // Notify the recipient of the new message
      if (this.io) {
        this.io.to(message.recipientId.toString()).emit('receiveMessage', savedMessage);
      }

      return savedMessage;
    } catch (error) {
      throw new Error('Could not save message');
    }
  }

  // Fetch conversation messages
  public async getMessages(senderId: string, recipientId: string): Promise<Message[]> {
    try {
      return await this.messageRepository.find({
        where: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
        order: { timestamp: 'ASC' },
      });
    } catch (error) {
      throw new Error('Could not retrieve messages');
    }
  }
}
