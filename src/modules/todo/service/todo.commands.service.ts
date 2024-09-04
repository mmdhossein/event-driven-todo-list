import {Inject, Injectable} from "@nestjs/common";
import {TodoItem, TodoList} from "../model/todo.model";
import mongoose, {Model, } from "mongoose";

import {
    BaseTodoDto,
    CreateTodoItemDto,
    CreateTodoListDto, DeleteTodoItemDto,
    DeleteTodoListDto,
    TodoCommands, UpdateTodoItemDto,
    UpdateTodoListDto
} from "../todo.dto.model";
import {TodoQueryService} from "./todo.query.service";
import {TodoService} from "./todo.service";
export abstract class TodoCommand {
    abstract process(req: BaseTodoDto)
}

@Injectable()
export class TodoCommandsService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        @Inject(TodoItem.name) private todoItemModel: Model<TodoItem>,private queryService:TodoQueryService) {
        this.registerTodoCommand(TodoCommands.LIST_CREATE, new CreateTodoList(todoListModel))
        this.registerTodoCommand(TodoCommands.LIST_DELETE, new DeleteTodoList(todoListModel, todoItemModel))
        this.registerTodoCommand(TodoCommands.LIST_UPDATE, new UpdateTodoList(todoListModel))
        this.registerTodoCommand(TodoCommands.ITEM_CREATE, new CreateTodoItem(todoListModel, todoItemModel, queryService))
        this.registerTodoCommand(TodoCommands.ITEM_UPDATE, new UpdateTodoItem(todoListModel,todoItemModel, queryService))
        this.registerTodoCommand(TodoCommands.ITEM_DELETE, new DeleteTodoItem(todoListModel,todoItemModel, queryService))
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
}

export class CreateTodoList implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>,) {
    }

    async process(req: CreateTodoListDto) {
        const todoList = new TodoList(req.userId, null, req.title)
        await this.todoListModel.insertMany([todoList])
        return
    }
}

export class UpdateTodoList implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>,) {
    }


    async process(req: UpdateTodoListDto) {
        await this.todoListModel.updateOne({_id: req.id, userId: req.userId}, {$set: {title: req.title}})
        return
    }
}

export class DeleteTodoList implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>,
        private todoItemModel: Model<TodoItem>) {
    }


    async process(req: DeleteTodoListDto) {
        await this.todoListModel.deleteOne({_id: req.id, userId: req.userId})
        await this.todoItemModel.deleteMany({todoListId:req.id})
        return
    }
}

export class CreateTodoItem implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>, private todoItemModel: Model<TodoItem>,
        private queryService:TodoQueryService) {
    }

    async process(req: CreateTodoItemDto) {
        const todoList = await this.queryService.getTodoListsById(req.todoListId, req.userId)
        console.log("todoList", todoList)
        if (!todoList || !todoList[0]) {
            throw  new Error('todo list not found!')
        }
        const todoItem = new TodoItem(todoList[0]._id, req.title, req.description, req.priority)
        const todoItemNew =  await this.todoItemModel.insertMany([todoItem])
        todoItem['_id'] = todoItemNew[0]._id
        if(!todoList[0].todoItems){todoList[0].todoItems = []}
        todoList[0].todoItems.push(todoItem)
        const sortedItemIds = TodoService.getItemListId(TodoService.orderItemPriority(todoList[0].todoItems))
        await this.todoListModel.updateOne({_id:req.todoListId, userId:req.userId}, {$set:{todoItems:sortedItemIds}})
        return
    }
}
export class UpdateTodoItem implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>, private todoItemModel: Model<TodoItem>,
        private queryService:TodoQueryService) {
    }

    async process(req: UpdateTodoItemDto) {
        const todoList = await this.queryService.getTodoListsById(req.todoListId, req.userId)
        if (!todoList || !todoList[0]) {
            throw  new Error('todo list not found!')
        }
        if(!todoList[0].todoItems.filter(item => item._id == req.id)[0]){
            throw  new Error('todo item not found!')
        }
        const updateDocument = {}
        if(req.title) {
            Object.assign(updateDocument, {title: req.title})
        }
        if(req.priority != null) {
            Object.assign(updateDocument, {priority: req.priority})
            todoList[0].todoItems.map((item) => {
                if(item._id == req.id){
                    item.priority = req.priority
                    return
                }
            })
            console.log('new todo list: ', todoList[0].todoItems)
            const sortedItemIds = TodoService.getItemListId(TodoService.orderItemPriority(todoList[0].todoItems))
            await this.todoListModel.updateOne({_id:req.todoListId, userId:req.userId}, {$set:{todoItems:sortedItemIds}})
        }
        if(req.description) {
            Object.assign(updateDocument, {description: req.description})
        }
        await this.todoItemModel.updateOne({_id:req.id}, {$set:updateDocument})
        return
    }
}
export class DeleteTodoItem implements TodoCommand {
    constructor(
        private todoListModel: Model<TodoList>, private todoItemModel: Model<TodoItem>,
        private queryService:TodoQueryService) {
    }

    async process(req: DeleteTodoItemDto) {
        const todoList = await this.queryService.getTodoListsById(req.todoListId, req.userId)
        if (!todoList || !todoList[0]) {
            throw  new Error('todo list not found!')
        }
        if(!todoList[0].todoItems.filter(item => {
            return item._id == req.id
        })[0]){
            throw  new Error('todo item not found!')
        }
        await this.todoItemModel.deleteOne({_id:req.id})

         todoList[0].todoItems.map((item, index, array)=>{
            if(item._id == req.id){
                array.splice(index, 1)
                return
            }
        })
        await this.todoListModel.updateOne({_id:req.todoListId, userId:req.userId}, {$set:{todoItems:todoList[0].todoItems}})

        return
    }
}