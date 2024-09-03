import {TodoItem, TodoList} from "./todo.model";
import {Inject} from "@nestjs/common";
import {Model} from "mongoose";

export class TodoQueryService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        @Inject(TodoItem.name) private todoItemModel: Model<TodoItem>) {
    }

    async getTodoLists(userName: string, userId): Promise<Array<TodoList>> {
        return this.todoListModel.aggregate([{
            $match: {userId: userId}
        },
            {
                $lookup: {
                    from: TodoList.name,
                    localField: "todoListId",
                    foreignField: "_id",
                    as: 'todoItems'
                }
            },
        ])
    }

    async getTodoListsById(id, userId): Promise<Array<TodoList>> {
        return this.todoListModel.aggregate([{
            $match: {userId: userId}
        },
            {
                $lookup: {
                    from: TodoList.name,
                    localField: "todoListId",
                    foreignField: "_id",
                    as: 'todoItems'
                }
            },
        ])
    }

    async findAndValidateUserTodoLists(todoListId, userId) {
        // const todoList = await this.getTodoListsById(todoListId, userId)
        // if (!todoList || !todoList[0]) {
        //     throw  new Error('todo list not found!')
        // }
        // if (!todoList[0].todoItems.filter(item => item._id == req.id)) {
        //     throw  new Error('todo item not found!')
        // }
    }

    async getTodoItem(id) {
        return this.todoItemModel.findOne({_id: id})
    }
}