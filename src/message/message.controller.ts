import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  public async createMessage(@Body() message: CreateMessageDto) {
    return await this.messageService.createMessage(message);
  }

  @Get()
  public async getMessages(@Query('senderId') senderId: string, @Query('recipientId') recipientId: string) {
    return await  this.messageService.getMessages(senderId, recipientId);
  }
}
