import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

