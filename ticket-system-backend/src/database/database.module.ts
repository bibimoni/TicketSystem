import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoUri, {
      dbName: config.mongoDB,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule { }

