import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Segment, SegmentDocument } from './segment.schema';
import { SubCategory, SubCategoryDocument } from '../subcategory/subcategory.schema';

@Injectable()
export class SegmentService {
  constructor(
    @InjectModel(Segment.name)
    private segmentModel: Model<SegmentDocument>,

    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
  ) { }

  async getAllSegments() {
    return this.segmentModel.find();
  }

  async getAllSegmentsBySubcategoriesId(subcategoriesId: string) {
    return this.segmentModel.find({ subcategoriesId: new Types.ObjectId(subcategoriesId) });
  }
}