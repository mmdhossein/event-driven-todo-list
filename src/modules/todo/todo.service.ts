import {Inject, Injectable} from "@nestjs/common";
import {TodoItem, TodoList} from "./todo.model";
import {Model} from "mongoose";
import {UserService} from "../auth/users/user.service";
import { QueueService} from "../queue/queue.service";
import {BaseTodoDto, CreateTodoListDto, DeleteTodoListDto, TodoCommands, TodoEventMessage} from "./todo.dto.model";


export abstract class TodoCommand {
    abstract process(req: BaseTodoDto)
}

export class CreateTodoList implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>,
        private userService: UserService,) {
    }

    async process(req: CreateTodoListDto) {
        const user = await this.userService.findUser(req.userName)
        const todoList = new TodoList(user._id, null, req.title)
        await this.todoListModel.insertMany([todoList])
        return
    }
}

@Injectable()
export class TodoService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        private userService: UserService, private queueService: QueueService) {
        this.registerTodoCommand(TodoCommands.LIST_CREATE, new CreateTodoList(todoListModel, userService))
        this.registerTodoCommand(TodoCommands.LIST_DELETE, new CreateTodoList(todoListModel, userService))
        this.registerTodoCommand(TodoCommands.LIST_UPDATE, new CreateTodoList(todoListModel, userService))
        this.registerTodoCommand(TodoCommands.ITEM_CREATE, new CreateTodoList(todoListModel, userService))
        this.registerTodoCommand(TodoCommands.ITEM_UPDATE, new CreateTodoList(todoListModel, userService))
        this.registerTodoCommand(TodoCommands.ITEM_DELETE, new CreateTodoList(todoListModel, userService))
    }

    private todoCommandsHandlers: Record<number, TodoCommand> = {}


    registerTodoCommand(method: number, command: TodoCommand) {
        this.todoCommandsHandlers[method] = command
    }


    async processCommand(req: BaseTodoDto, method: number) {
        const command = this.todoCommandsHandlers[method]
        if (command) {
            await command.process(req)
        } else {
            throw new Error('command not found, command: ' + method)
        }
    }


    async getTodoLists(userName: string): Promise<Array<TodoList>> {
        const user = await this.userService.findUser(userName)
        return this.todoListModel.aggregate([{
            $match: {userId: user._id}
        },
            {
                $lookup: {
                    from: TodoList.name,
                    localField: "todoListId",
                    foreignField: "_id",
                    as: TodoItem.name
                }
            },
        ])
    }

    async createTodoListEvent(req: CreateTodoListDto) {
        const user = await this.userService.findUser(req.userName)
        req.userId = user._id
        console.log('teststs, ', new TodoEventMessage(TodoCommands.LIST_CREATE, req))
        await this.queueService.publishMessage('todo_queue', new TodoEventMessage(TodoCommands.LIST_CREATE, req))
        return
    }


    async deleteTodoListEvent(deleteTodoDto: DeleteTodoListDto) {
        await this.queueService.publishMessage('todo_queue_create', deleteTodoDto)
    }

}
