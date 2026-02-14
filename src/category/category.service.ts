import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) { }

    async getAllCategories() {
        return this.categoryModel.find();
    }

    async getCategoryTree() {
        return this.categoryModel.aggregate([
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subcategories",
                },
            },
            {
                $lookup: {
                    from: "segments",
                    localField: "subcategories._id",
                    foreignField: "subCategoryId",
                    as: "segments",
                },
            },
        ]);
    }
}
