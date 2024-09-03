import {Module} from "@nestjs/common";
import {TodoController} from "./todo.controller";
import {TodoService} from "./todo.service";
import {AuthModule} from "../auth/auth.module";
import {QueueModule} from "../queue/queue.module";
import {JwtService} from "@nestjs/jwt";
import {TodoCommandsService} from "./todo.commands.service";
import {TodoQueryService} from "./todo.query.service";

@Module({controllers:[TodoController],
    providers:[TodoService,JwtService,TodoCommandsService,TodoQueryService],
    imports:[AuthModule,QueueModule,],})
export class TodoModule {

}