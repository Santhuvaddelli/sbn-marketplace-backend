import { Controller, Get, Param, Query } from '@nestjs/common';
import { SegmentService } from './segment.service';

@Controller('segments')
export class SegmentController {
  constructor(private readonly segService: SegmentService) { }

  @Get()
  async getAllSegments(@Query('subcategoryId') subcategoryId: string) {
    if (subcategoryId) {
      return this.segService.getAllSegmentsBySubcategoriesId(subcategoryId);
    }
    return this.segService.getAllSegments();
  }
}
