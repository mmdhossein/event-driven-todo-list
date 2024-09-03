import {HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {TodoItem, TodoList} from "./todo.model";
import {Model} from "mongoose";
import {UserService} from "../auth/users/user.service";
import { QueueService} from "../queue/queue.service";
import {
    BaseTodoDto, CreateTodoItemDto,
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

    async getTodoLists(userId){
       const todoLists:Array<TodoList> =   await this.queryService.getTodoLists(userId)
        if(todoLists){
            for(const l of todoLists){
                l.todoItems = TodoService.orderItemPriority(l.todoItems)
            }
        }
        return todoLists
    }
    static orderItemPriority(itemList:Array<TodoItem>){
        return itemList.sort(function (a, b){return a.priority - b.priority})
    }
    static getItemListId(itemList:Array<TodoItem>){
        return itemList.map((item,) => {return item['_id']})
    }


    async createTodoListEvent(req: CreateTodoListDto, userId) {
        req.userId = userId
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_CREATE, req))
        return
    }
    async updateTodoListEvent(req: UpdateTodoListDto,userId) {
        req.userId = userId
        const todoList = await this.queryService.getTodoListsById(req.id, req.userId)
        if (!todoList || !todoList[0]) {
            throw  new HttpException('todo list not found!', HttpStatus.BAD_REQUEST)
        }
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_UPDATE, req))
        return
    }

    async deleteTodoListEvent(req: DeleteTodoListDto, userId) {
        req.userId = userId
        const todoList = await this.queryService.getTodoListsById(req.id, req.userId)
        if (!todoList || !todoList[0]) {
            throw  new HttpException('todo list not found!', HttpStatus.BAD_REQUEST)
        }
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.LIST_DELETE, req))
        return
    }


    async createItemEvent(req: CreateTodoItemDto, userId) {
        req.userId = userId
        const todoList = await this.queryService.getTodoListsById(req.todoListId, req.userId)
        if (!todoList || !todoList[0]) {
            throw  new HttpException('todo list not found!', HttpStatus.BAD_REQUEST)
        }
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.ITEM_CREATE, req))
        return
    }
    async updateItemEvent(req: UpdateTodoListDto,userId) {
        req.userId = userId
        const todoList = await this.queryService.getTodoListByItemId(req.id, req.userId)
        req.todoListId =todoList._id
        if (!todoList) {
            throw  new HttpException('todo list not found!', HttpStatus.BAD_REQUEST)
        }
        if (!todoList.todoItems.filter(item => item._id == req.id)[0]) {
            throw  new HttpException('todo item not found!', HttpStatus.BAD_REQUEST)
        }
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.ITEM_UPDATE, req))
        return
    }

    async deleteItemEvent(req: DeleteTodoListDto, userId) {
        req.userId = userId
        const todoList = await this.queryService.getTodoListByItemId(req.id, req.userId)
        if (!todoList) {
            throw  new HttpException('todo list not found!', HttpStatus.BAD_REQUEST)
        }
        req.todoListId = todoList._id
        await this.queueService.publishMessage(process.env.QUEUE_SUBJECT, new TodoEventMessage(TodoCommands.ITEM_DELETE, req))
        return
    }

}
