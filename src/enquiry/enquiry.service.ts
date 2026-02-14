import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enquiry, EnquiryDocument } from './enquiry.schema';
import { Product, ProductDocument } from 'src/product/product.schema';

@Injectable()
export class EnquiryService {
    constructor(
        @InjectModel(Enquiry.name)
        private readonly enquiryModel: Model<EnquiryDocument>,

        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>

    ) { }

    async createEnquiry(data: any) {
        if (!data) {
            throw new Error("Please provide all the details")
        }
        const { productId, name, phone, email, message } = data;
        if (!productId || !name || !phone || !email) {
            throw new Error("All Fields are required")
        }
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const createEnquiry = new this.enquiryModel({
            productId,
            sellerId: product.userId,
            name,
            phone,
            email,
            message
        });
        await createEnquiry.save();
        return {
            message: 'Enquiry created successfully',
        }
    }

    async getMyEnquiry(userId: string) {
        return this.enquiryModel.find({
            sellerId: new Types.ObjectId(userId),
        }).populate({
            path: 'productId',
            select: 'name',
        });
    }
}
