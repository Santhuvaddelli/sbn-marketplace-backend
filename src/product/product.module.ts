import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Segment, SegmentSchema } from '../segment/segment.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Category, CategorySchema } from '../category/category.schema';
import { SubCategory, SubCategorySchema } from '../subcategory/subcategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Segment.name, schema: SegmentSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
})
export class ProductModule { }
