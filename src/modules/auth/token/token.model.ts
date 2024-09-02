import {Prop} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";

export class AuthDto {
    @Prop({type:String})
    @ApiProperty()
    userName:string
    @Prop({type:String})
    @ApiProperty()
    password:string

    constructor(userName: string, password: string) {
        this.userName = userName;
        this.password = password;
    }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class AppContextData {
    user:AuthDto
}



export const AppContext = createParamDecorator(
    (data: string, ctx: ExecutionContext):AppContextData => {
        const request = ctx.switchToHttp().getRequest();
        return  request['AppContextData'];
    },
);
