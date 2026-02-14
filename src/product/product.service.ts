import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { Segment, SegmentDocument } from '../segment/segment.schema';
import { Category, CategoryDocument } from '../category/category.schema';
import { SubCategory, SubCategoryDocument } from '../subcategory/subcategory.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,

    @InjectModel(Segment.name)
    private segmentModel: Model<SegmentDocument>,

    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,

    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
  ) { }

  // Helper to convert URL param (e.g. "smart-phones") to Name Regex (e.g. /smart phones/i)
  private nameToRegex(name: string) {
    const escapedName = name.replace(/-/g, ' '); // Assume dashes in URL are spaces in DB
    return new RegExp(`^${escapedName}$`, 'i');
  }

  // Get Products by Category Name
  async getProductsByCategoryName(categoryName: string) {
    // 1. Find Category
    const category = await this.categoryModel.findOne({ name: this.nameToRegex(categoryName) });
    if (!category) return [];

    // 2. Find SubCategories in this Category
    const subCategories = await this.subCategoryModel.find({ categoryId: category._id });
    const subCategoryIds = subCategories.map(sub => sub._id);

    // 3. Find Segments in these SubCategories
    const segments = await this.segmentModel.find({ subCategoryId: { $in: subCategoryIds } });
    const segmentIds = segments.map(seg => seg._id);

    // 4. Find Products in these Segments
    return this.productModel.find({ segmentId: { $in: segmentIds } });
  }

  // Get Products by SubCategory Name
  async getProductsBySubCategoryName(subCategoryName: string) {
    // 1. Find SubCategory
    const subCategory = await this.subCategoryModel.findOne({ name: this.nameToRegex(subCategoryName) });
    if (!subCategory) return [];

    // 2. Find Segments in this SubCategory
    const segments = await this.segmentModel.find({ subCategoryId: subCategory._id });
    const segmentIds = segments.map(seg => seg._id);

    // 3. Find Products in these Segments
    return this.productModel.find({ segmentId: { $in: segmentIds } });
  }

  // Get Products by Segment Name
  async getProductsBySegmentName(segmentName: string) {
    // 1. Find Segment
    const segment = await this.segmentModel.findOne({ name: this.nameToRegex(segmentName) });
    if (!segment) return [];

    // 2. Find Products in this Segment
    return this.productModel.find({ segmentId: segment._id });
  }

  // Get Single Product by Name
  async getProductByName(name: string) {
    return this.productModel.findOne({ name: this.nameToRegex(name) });
  }

  // Get my products
  async getMyProducts(userId: any) {
    return this.productModel.find({ userId: new Types.ObjectId(userId) });
  }

  // Get All Products (Public API)
  async getAllProducts() {
    return this.productModel.find();
  }

  // Create product
  async createProduct(data: any, userId: string) {
    if (!data.segmentId) {
      throw new BadRequestException('Segment ID is required');
    }
    const segment = await this.segmentModel.findById(data.segmentId);
    if (!segment) throw new BadRequestException('Invalid segment');

    return this.productModel.create({
      ...data,
      userId: new Types.ObjectId(userId),
      segmentId: new Types.ObjectId(data.segmentId),
    });
  }

  // update the product
  async updateProduct(productId: string, data: any, userId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error('Product Not Found');
    }
    if (product.userId.toString() != userId) {
      throw new Error("You are not authorized to update this product");
    }

    // Explicitly cast segmentId to ObjectId to ensure correct storage/matching
    if (data.segmentId) {
      data.segmentId = new Types.ObjectId(data.segmentId);
    }

    // Explicitly cast price to Number
    if (data.price) {
      data.price = Number(data.price);
    }

    // Handle Media Merging
    // existingMedia: list of media objects kept by user
    // newMedia: list of new media objects uploaded during this update
    const existingMedia = data.existingMedia || [];
    const newMedia = data.newMedia || [];

    // If the user provided existingMedia (even empty), we merge.
    // If they didn't provide it at all, we don't touch media unless newMedia exists.
    if (data.existingMedia !== undefined || newMedia.length > 0) {
      data.media = [...existingMedia, ...newMedia];
    }

    // Clean up temporary fields
    delete data.existingMedia;
    delete data.newMedia;

    Object.assign(product, data);
    await product.save();

    return {
      message: "Product Updated Successfuly",
      product,
    }
  }

  // Delete the product
  async deleteProduct(productId: string, userId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new Error("Product Not Found");
    }
    if (product.userId.toString() != userId) {
      throw new Error("You are not authorized to delete this record");
    }
    await product.deleteOne();
    return {
      message: "Product Deleted Successfully",
      product,
    }
  }

  // Global Search
  async search(query: string) {
    const regex = new RegExp(query, 'i');

    const [products, categories, subcategories, segments] = await Promise.all([
      this.productModel.find({ name: regex }).limit(10),
      this.categoryModel.find({ name: regex }).limit(5),
      this.subCategoryModel.find({ name: regex }).populate('categoryId').limit(5),
      this.segmentModel.find({ name: regex })
        .populate({
          path: 'subCategoryId',
          populate: { path: 'categoryId' }
        })
        .limit(5),
    ]);

    return {
      products,
      categories,
      subcategories,
      segments,
    };
  }

}
