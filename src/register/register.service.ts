import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Register, RegisterDocument } from './register.schema';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
    constructor(
        @InjectModel(Register.name)
        private registerModel: Model<RegisterDocument>,
        private jwtService: JwtService,
    ) { }

    async register(data: any) {
        const { firstName, lastName, email, password, phone, companyName, designation, companyWebsite, location } = data;

        const user = await this.registerModel.findOne({ email });
        if (user) {
            throw new BadRequestException("User already exists");
        }
        if (!firstName || !lastName || !email || !password || !phone || !companyName || !designation) {
            throw new BadRequestException("All fields are required");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.registerModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            companyName,
            designation,
            companyWebsite,
            location,
        });
        await newUser.save();

        return {
            message: "User Registered Successfully",
            email: email,
        }
    }

    async login(email: string, password: string) {
        const user = await this.registerModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("User Not Found");
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException("Invalid Password");
        }
        const payload = { email: user.email, id: user._id };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.SECRET_KEY,
            expiresIn: '1d',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET_KEY,
            expiresIn: '7d',
        });
        user.refreshToken = refreshToken;
        await user.save();
        return {
            message: "Login Success",
            accessToken,
            refreshToken,
        }
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_SECRET_KEY,
            });
            const user = await this.registerModel.findById(decoded.id);
            if (!user) {
                throw new UnauthorizedException("User Not Found");
            }
            if (user.refreshToken != refreshToken) {
                throw new UnauthorizedException("Refresh Token Mismatch or Invalid Refresh Token");
            }
            const payload = { email: user.email, id: user._id };
            const newAccessToken = this.jwtService.sign(payload, {
                secret: process.env.SECRET_KEY,
                expiresIn: '1d',
            });
            return {
                message: "Access Token Generated Successfully",
                accessToken: newAccessToken,
            };

        }
        catch (error) {
            throw new UnauthorizedException("Refresh Token Expired " + error.message);
        }
    }

    async getMyProfile(userId: string) {
        const user = await this.registerModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException("User Not Found");
        }
        return {
            message: "User Profile",
            user,
        }
    }

    async updateProfile(userId: string, data: any) {
        const user = await this.registerModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException("User Not Found");
        }

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.phone = data.phone;
        user.companyName = data.companyName;
        user.designation = data.designation;
        user.companyWebsite = data.companyWebsite;
        user.location = data.location;
        await user.save();
        return {
            message: "User Profile Updated Successfully",
            user,
        }
    }
}
