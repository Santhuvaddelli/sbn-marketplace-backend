import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ type: Map, of: String })
  specifications: Map<string, string>;

  @Prop([
    {
      url: { type: String, required: true },
      resourceType: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
    },
  ])
  media: {
    url: string;
    resourceType: 'image' | 'video';
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Segment', required: true })
  segmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Register', required: true })
  userId: Types.ObjectId;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
