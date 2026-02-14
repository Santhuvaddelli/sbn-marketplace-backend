import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EnquiryDocument = Enquiry & Document;

@Schema({ timestamps: true })
export class Enquiry {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'Register', required: true })
    sellerId: Types.ObjectId;
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    phone: string;
    @Prop({ required: true })
    email: string;
    @Prop()
    message: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);