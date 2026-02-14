import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Segment, SegmentSchema } from './segment.schema';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { SubCategory, SubCategorySchema } from '../subcategory/subcategory.schema';
import { Category, CategorySchema } from '../category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Segment.name, schema: SegmentSchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
