import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {ApiBody, ApiOkResponse} from "@nestjs/swagger";
import { TokenService} from "./token.service";
import {AuthDto} from "./token.model";
import {Public} from "../../../config/guard/guard.auth";


@Controller('auth/token')
export class TokenController{
    constructor(private readonly authService: TokenService,) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    @ApiBody({type: AuthDto})
    @ApiOkResponse({schema:{properties:{access_token:{type:'string'}}}})
    @Public()
    register(@Body() signInDto: AuthDto) {
        return this.authService.register(signInDto.userName, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody({type: AuthDto})
    @ApiOkResponse({schema:{properties:{access_token:{type:'string'}}}})
    @Public()
    login(@Body() signInDto: AuthDto) {
        return this.authService.login(signInDto.userName, signInDto.password);
    }
}