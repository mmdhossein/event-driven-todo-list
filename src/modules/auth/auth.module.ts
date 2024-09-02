import {Module} from "@nestjs/common";
import {TokenController} from "./token/token.controller";
import {TokenService} from "./token/token.service";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./users/user.service";

@Module({controllers:[TokenController], providers:[TokenService,JwtService,UserService],
    exports:[UserService]})
export class AuthModule {

}