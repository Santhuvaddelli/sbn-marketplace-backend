import { Controller, UseGuards } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { Post, Body, Get, Req } from '@nestjs/common';
import { Enquiry } from './enquiry.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('enquiry')
export class EnquiryController {
    constructor(private readonly enquiryService: EnquiryService) { }

    @Post('/createEnquiry')
    async createEnquiry(@Body() enquiry: Enquiry) {
        return this.enquiryService.createEnquiry(enquiry);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/myEnquiries')
    async getMyEnquiry(@Req() req: any) {
        return this.enquiryService.getMyEnquiry(req.user.userId);
    }
}
