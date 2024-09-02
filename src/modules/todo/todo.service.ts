import {Inject, Injectable} from "@nestjs/common";
import {TodoItem, TodoList} from "./todo.model";
import {Model} from "mongoose";
import {UserService} from "../auth/users/user.service";
import {QueueNatsService, QueueService, TransportService} from "../queue/queue.service";
import {CreateTodoListDto, DeleteTodoListDto, TodoCommands, TodoEventMessage} from "./todo.dto.model";

@Injectable()
export class TodoService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        private userService: UserService,  private queueService: QueueService) {
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

    async createTodoListEvent(data: CreateTodoListDto) {
        const user = await this.userService.findUser(data.userName)
        data.userId = user._id
        await this.queueService.publishMessage(process.env.NATS_QUEUE_LIST_CMD, new TodoEventMessage(TodoCommands.LIST_CREATE, data))
    return
    }

    async deleteTodoListEvent(deleteTodoDto: DeleteTodoListDto) {
        await this.queueService.publishMessage('todo_queue_create', deleteTodoDto)
    }

    async createTodoList(title: string, userName: string) {
        const user = await this.userService.findUser(userName)
        const todoList = new TodoList(user._id, [], title)
        await this.todoListModel.insertMany([todoList])
        return

    }
}