import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';

@Controller('subcategories')
export class SubCategoryController {
  constructor(private readonly subService: SubCategoryService) { }

  @Get()
  async getAllSubCategories(@Query('categoryId') categoryId: string) {
    if (categoryId) {
      return this.subService.getAllSubCategoriesByCategoryId(categoryId);
    }
    return this.subService.getAllSubCategories();
  }
}
