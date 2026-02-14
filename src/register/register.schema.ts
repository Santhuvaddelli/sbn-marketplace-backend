import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RegisterDocument = Register & Document;

@Schema({ timestamps: true })
export class Register extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    companyName: string;

    @Prop({ required: true })
    designation: string;

    @Prop()
    companyWebsite: string;

    @Prop({ required: true })
    location: string;

    @Prop()
    refreshToken: string;
}

export const RegisterSchema = SchemaFactory.createForClass(Register);
