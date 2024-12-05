import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
// import { Message } from './message.entity';
// import { MessageRepository } from './message.repository'; // import if it's a custom repository

@Module({
  imports: [TypeOrmModule.forFeature([Message])], // Add Message here to provide MessageRepository
  providers: [MessageService],
  controllers:[MessageController],
  exports: [MessageService],
})
export class MessageModule {}
