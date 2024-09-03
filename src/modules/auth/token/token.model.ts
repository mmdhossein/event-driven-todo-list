import {Prop} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";
import * as mongoose from 'mongoose'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class AuthDto {
    @Prop({type:String})
    @ApiProperty()
    userName:string
    @Prop({type:String})
    @ApiProperty()
    password:string
    @Prop({type:mongoose.Schema.Types.ObjectId})
    _id

    constructor(userName: string, password: string) {
        this.userName = userName;
        this.password = password;
    }
}


export class AppContextData {
    user:AuthDto
}



export const AppContext = createParamDecorator(
    (data: string, ctx: ExecutionContext):AppContextData => {
        const request = ctx.switchToHttp().getRequest();
        return  request['AppContextData'];
    },
);
