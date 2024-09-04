import {BadRequestException,Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {UserService} from "../../users/service/user.service";
import {User} from "../../users/model/user.model";

@Injectable()
export class TokenService {

    constructor(private jwtService: JwtService,
                private userService:UserService
                ) {
    }

    async login(username: string, password: string): Promise<any> {
        const user = await this.userService.findUser(username)
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('username or password is incorrect');
        }
        const authBody = new User(username, bcrypt.hashSync(password, Number(process.env.HASH_SALT)))
        return {
            access_token: await this.jwtService.signAsync(JSON.stringify(authBody),{secret:process.env.JWT_SECRET}),
        };
    }

    async register(username: string, password: string): Promise<any> {
        const userCreated = await this.userService.findUser(username)
        if (userCreated) {
            throw new BadRequestException('username already exists');
        }
        const user = new User(username, bcrypt.hashSync(password, Number(process.env.HASH_SALT)))
        await this.userService.saveUser(user)


        return {
            access_token: await this.jwtService.signAsync(JSON.stringify(user), {secret:process.env.JWT_SECRET}),
        };
    }
}