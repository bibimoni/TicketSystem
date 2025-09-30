import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule { }

