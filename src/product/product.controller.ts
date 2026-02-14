import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Query,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly prodService: ProductService,
    private readonly cloudService: CloudinaryService,
  ) { }

  @Get("/allProducts")
  async getAllProducts() {
    return this.prodService.getAllProducts();
  }

  @Get("/search")
  async search(@Query('q') query: string) {
    return this.prodService.search(query);
  }

  @Get("/category/:name")
  async getProductsByCategory(@Param('name') name: string) {
    return this.prodService.getProductsByCategoryName(name);
  }

  @Get("/subcategory/:name")
  async getProductsBySubCategory(@Param('name') name: string) {
    return this.prodService.getProductsBySubCategoryName(name);
  }

  @Get("/segment/:name")
  async getProductsBySegment(@Param('name') name: string) {
    return this.prodService.getProductsBySegmentName(name);
  }

  @Get("/details/:name")
  async getProductByName(@Param('name') name: string) {
    return this.prodService.getProductByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/myProducts")
  async getMyProducts(@Request() req: any) {
    return this.prodService.getMyProducts(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/createProduct")
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() body: any,
    @Request() req: any,
  ) {
    const uploadedMedia: {
      url: string,
      resourceType: 'image' | 'video';
    }[] = [];

    if (files?.length) {
      const uploadPromises = files.map(file => this.cloudService.uploadFile(file));
      uploadedMedia.push(...await Promise.all(uploadPromises));
    }

    body.specifications = body.specifications
      ? JSON.parse(body.specifications)
      : {};

    body.media = uploadedMedia;

    return this.prodService.createProduct(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/updateProduct")
  @UseInterceptors(FilesInterceptor('files'))
  async updateProduct(
    @Query('productId') productId: string,
    @Body() body: any,
    @Request() req: any,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const uploadedMedia: {
      url: string,
      resourceType: 'image' | 'video';
    }[] = [];

    if (files?.length) {
      const uploadPromises = files.map(file => this.cloudService.uploadFile(file));
      uploadedMedia.push(...await Promise.all(uploadPromises));
    }

    if (body.specifications && typeof body.specifications === 'string') {
      body.specifications = JSON.parse(body.specifications);
    }

    if (body.existingMedia && typeof body.existingMedia === 'string') {
      body.existingMedia = JSON.parse(body.existingMedia);
    }

    if (uploadedMedia.length > 0) {
      // Logic to either replace or append media.
      // We'll pass the new media as 'newMedia' or just 'media' and let service merge.
      body.newMedia = uploadedMedia;
    }

    return this.prodService.updateProduct(productId, body, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("deleteProduct")
  async deleteProduct(@Query('productId') productId: string, @Request() req: any) {
    return this.prodService.deleteProduct(productId, req.user.userId);
  }
}
