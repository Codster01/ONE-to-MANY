import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/users.models';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dto/auth.dto';
import * as bcrypt from "bcrypt";
import { LoginDto } from 'src/dto/login.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService){}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(userId: string): Promise<User> {
        return this.userModel.findById(userId).exec();
    }

    async RegisterView(data: RegisterDto){
        const chk_user = await this.userModel.findOne({email: data.email.toLowerCase()})

        if (chk_user) {
            throw new BadRequestException("User Already Exists!");
        }
        const newUser = await this.userModel.create({
            email: data.email,
            password: data.password,
            name: data.name,
        });
        const token = await this.jwtService.sign({userId: newUser._id});

        return {
            token: token,
            email: data.email,
            name: data.name
        };

    }

    async LoginView(data: LoginDto) {
        const chk_user = await this.userModel.findOne({email: data.email.toLowerCase()});

        if (!chk_user) {
            throw new BadRequestException("User Does Not Exists!");
        }

        // If password == string

        const isMatch = await bcrypt.compare(data.password, chk_user.password);

        if (!isMatch) {
            throw new BadRequestException('Invalid Credentials!');
        }

        const token = this.jwtService.sign({userId: chk_user._id})
        const userRole = chk_user.role;

        return {
            name: chk_user.name, // Assuming 'name' is a field in chk_user
            userRole: userRole,
            token: token,
        }

    }
    
    async profileView(id: string) {
        console.log(id);

        const chk_user = await this.userModel.findById(id).exec();

        if(!chk_user) {
            throw new BadRequestException("User Not Existing!");
        }

        return chk_user;
    }
}
