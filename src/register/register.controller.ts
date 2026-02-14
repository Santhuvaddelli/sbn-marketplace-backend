import { Controller, Post, Body, Get, UseGuards, Request, Put } from '@nestjs/common';
import { RegisterService } from './register.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Post("register")
    async register(@Body() data: any) {
        return this.registerService.register(data);
    }

    @Post("login")
    async login(@Body() data: any) {
        return this.registerService.login(data.email, data.password);
    }

    @Post("refresh")
    async refreshAccessToken(@Body() data: any) {
        return this.registerService.refreshAccessToken(data.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/myProfile")
    async getMyProfile(@Request() req: any) {
        return this.registerService.getMyProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/updateProfile")
    async updateProfile(@Request() req: any, @Body() data: any) {
        return this.registerService.updateProfile(req.user.userId, data);
    }
}
