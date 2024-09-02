import {Inject} from "@nestjs/common";
import {Model} from "mongoose";
import {User} from "./user.model";

export class UserService {
    constructor(@Inject(User.name) private userModel: Model<User>) {
    }
   async findUser(username:string){
        return this.userModel.findOne({userName: username}).exec()
    }
   async saveUser(user:User){
        await (new this.userModel(user)).save()
    }

}