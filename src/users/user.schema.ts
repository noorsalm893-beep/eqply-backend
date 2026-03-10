import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: ['student', 'freelancer', 'vendor'], required: true })
  role: string;

  @Prop({ type: String, default: null })
  phone: string;

  @Prop({ type: String, default: null })
  profilePhoto: string;

  @Prop({ type: String, default: null })
  location: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string;

  @Prop({ type: Date, default: null })
  verificationTokenExpires: Date;

  @Prop({ type: String, default: null })
  passwordResetToken: string;

  @Prop({ type: Date, default: null })
  passwordResetExpires: Date;

  @Prop({ type: Date, default: null })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);