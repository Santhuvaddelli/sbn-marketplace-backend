import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Register, RegisterSchema } from './register.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Register.name, schema: RegisterSchema, collection: "stakeholders" }]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, JwtStrategy]
})
export class RegisterModule { }
