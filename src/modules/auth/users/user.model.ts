import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {AuthDto} from "../token/token.model";


@Schema()
export class User extends AuthDto {
    @Prop({type: Date})
    creationDate: Date
}

export type UserDocument = HydratedDocument<User>;


export const UserSchema = SchemaFactory.createForClass(User);