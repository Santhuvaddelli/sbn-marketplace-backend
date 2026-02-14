import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Enquiry, EnquirySchema } from './enquiry.schema';
import { Product, ProductSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enquiry.name, schema: EnquirySchema },
      { name: Product.name, schema: ProductSchema },
    ])
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService]
})
export class EnquiryModule { }
