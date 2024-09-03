import {TodoItem, TodoList} from "./todo.model";
import {Inject} from "@nestjs/common";
import mongoose, {Model, } from "mongoose";

export class TodoQueryService {
    constructor(
        @Inject(TodoList.name) private todoListModel: Model<TodoList>,
        @Inject(TodoItem.name) private todoItemModel: Model<TodoItem>) {
    }

    async getTodoLists(userId): Promise<Array<TodoList>> {
        return this.todoListModel.aggregate([{
            $match: {userId: userId}
        },
            {
                $lookup: {
                    from: 'todoitems',
                    localField: "todoItems",
                    foreignField: "_id",
                    as: 'todoItems'
                }
            },
        ]).project({_id:1, todoItems:1, title:1})
    }

    async getTodoListsById(id, userId): Promise<Array<TodoList>> {
        return this.todoListModel.aggregate([{
            $match: {_id:new mongoose.Types.ObjectId(id), userId:new mongoose.Types.ObjectId(userId)}
        },
            {
                $lookup: {
                    from: 'todoitems',
                    localField: "todoItems",
                    foreignField: "_id",
                    as: 'todoItems'
                }
            },
        ])
    }
    async getTodoListByItemId(id, userId):Promise<TodoList>{
        return this.todoListModel.findOne({"todoItems":new mongoose.Types.ObjectId(id), userId}).exec()
    }

}