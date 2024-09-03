import {Inject, Injectable} from "@nestjs/common";
import { TodoList} from "./todo.model";
import {Model} from "mongoose";
import {UserService} from "../auth/users/user.service";
import { QueueService} from "../queue/queue.service";
import {
    BaseTodoDto,
    CreateTodoListDto,
    DeleteTodoListDto,
    TodoCommands,
    TodoEventMessage,
    UpdateTodoListDto
} from "./todo.dto.model";
import {TodoCommandsService} from "./todo.commands.service";
import {TodoQueryService} from "./todo.query.service";


@Injectable()
export class TodoService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        private userService: UserService, private queueService: QueueService,
        private todoCommandsService:TodoCommandsService,private queryService:TodoQueryService) {
    }

    async processCommand(req: BaseTodoDto, method: number) {
        await this.todoCommandsService.processCommand(req,method)
        return
    }

    async getTodoLists(userName: string, userId){
       return  this.queryService.getTodoLists(userName, userId)
    }




    async createTodoListEvent(req: CreateTodoListDto, userId) {
        req.userId = userId
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_CREATE, req))
        return
    }
    async updateTodoListEvent(req: UpdateTodoListDto,userId) {
        req.userId = userId
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_UPDATE, req))
        return
    }

    async deleteTodoListEvent(req: DeleteTodoListDto, userId) {
        req.userId = userId
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_DELETE, req))
        return
    }

}
