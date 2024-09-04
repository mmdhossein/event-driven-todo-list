import {Module} from "@nestjs/common";
import {TokenController} from "./token/controller/token.controller";
import {TokenService} from "./token/service/token.service";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./users/service/user.service";

@Module({controllers:[TokenController], providers:[TokenService,JwtService,UserService],
    exports:[UserService]})
export class AuthModule {

}