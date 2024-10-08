import { BadRequestException, NotFoundException,Body, Put, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Patch, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { User,UserRole } from 'src/models/users.models';
import { RegisterDto } from 'src/dto/auth.dto';
import { LoginDto } from 'src/dto/login.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../auth.guard';
import { UpdateUserRoleDto } from "../../dto/update-user-role.dto";
import { UpdateUserPermissionsDto } from '../../dto/update-user-permissions.dto';
import { AdminGuard } from 'src/admin/admin.guard';
import { AuthModule } from '../auth.module';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUser() : Promise<User[]>{
        return this.userService.findAll();
    }

    @Get("/api/getUsers") 
    async getUserName() {
        return this.userService.findUsers();
    }

    @Post('register')
    async postData(@Body() data: RegisterDto) {
        return this.userService.RegisterView(data);
    }

    @Post("login")
    async postLogin(@Body() data: LoginDto) {
        return this.userService.LoginView(data);
    }
    
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Get('profile')
    async profileView(@Request() req) {
        const user = await req?.user;
        if (!user || user.userId) {
            throw new BadRequestException("User Not Found!");
        }
        console.log(user);
        return this.userService.profileView(user?.userId);
    }
    
    @Put('update-role')
    async updateUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
      return this.userService.updateUserRole(updateUserRoleDto.userId, updateUserRoleDto.roleId);
    }

   
}
