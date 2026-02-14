import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubCategory, SubCategoryDocument } from './subcategory.schema';
import { Category, CategoryDocument } from '../category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,

    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) { }

  async getAllSubCategories() {
    return this.subCategoryModel.find();
  }

  async getAllSubCategoriesByCategoryId(categoryId: string) {
    return this.subCategoryModel.find({ categoryId: new Types.ObjectId(categoryId) });
  }
}