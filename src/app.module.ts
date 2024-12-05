import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ChatGateway } from './chat/chat.gateway';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '3306')),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'ganesh11499'),
        database: configService.get('DB_NAME', 'chatapp'),
        synchronize: true, 
        entities:[User, Message],
      }),
    }),
    UserModule,
    MessageModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
