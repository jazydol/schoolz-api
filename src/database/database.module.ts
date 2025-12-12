import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        dbName: 'schoolz',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
