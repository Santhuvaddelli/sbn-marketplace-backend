import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { SegmentModule } from './segment/segment.module';
import { ProductModule } from './product/product.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { RegisterModule } from './register/register.module';
import { EnquiryModule } from './enquiry/enquiry.module';

@Module({
  imports:
    [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (ConfigService: ConfigService) => ({
          uri: ConfigService.get<string>('MONGODB_URL'),
        }),
      }),
      CategoryModule,
      SubCategoryModule,
      SegmentModule,
      ProductModule,
      RegisterModule,
      EnquiryModule,
    ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
