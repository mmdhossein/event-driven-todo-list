import {Module} from "@nestjs/common";
import {TodoController} from "./todo.controller";
import {TodoService} from "./todo.service";
import {AuthModule} from "../auth/auth.module";
import {QueueModule} from "../queue/queue.module";
import {JwtService} from "@nestjs/jwt";

@Module({controllers:[TodoController],
    providers:[TodoService,JwtService],
    imports:[AuthModule,QueueModule,],})
export class TodoModule {

}