import {Module} from "@nestjs/common";
import {TodoController} from "./controller/todo.controller";
import {TodoService} from "./service/todo.service";
import {AuthModule} from "../auth/auth.module";
import {QueueModule} from "../queue/queue.module";
import {JwtService} from "@nestjs/jwt";
import {TodoCommandsService} from "./service/todo.commands.service";
import {TodoQueryService} from "./service/todo.query.service";

@Module({controllers:[TodoController],
    providers:[TodoService,JwtService,TodoCommandsService,TodoQueryService],
    imports:[AuthModule,QueueModule,],})
export class TodoModule {

}