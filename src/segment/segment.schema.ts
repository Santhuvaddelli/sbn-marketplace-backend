import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SegmentDocument = Segment & Document;

@Schema()
export class Segment {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: true })
  subCategoryId: Types.ObjectId;
}

export const SegmentSchema = SchemaFactory.createForClass(Segment);
