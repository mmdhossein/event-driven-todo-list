import {Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import {HydratedDocument, ObjectId} from 'mongoose';
import {User} from "../auth/users/user.model";
import {ApiProperty} from "@nestjs/swagger";
import * as mongoose from "mongoose";

@Schema({})
export class TodoItem {

    @Prop({type:mongoose.Schema.Types.ObjectId})
    todoListId: ObjectId
    @Prop()
    title: string
    @Prop()
    description: string
    @Prop()
    priority: number

}

export type todoItemDocument = HydratedDocument<TodoItem>;
export const TodoItemSchema = SchemaFactory.createForClass(TodoItem);

@Schema({})
export class TodoList {

    constructor(userId, todoItems: Array<ObjectId>=[], title: string) {
        this.userId = userId;
        this.todoItems = todoItems;
        this.title = title;
    }

    @Prop({type:mongoose.Schema.Types.ObjectId,ref: User.name})
    @ApiProperty({type:mongoose.Schema.Types.ObjectId})
    userId: ObjectId
    @Prop({ref:TodoItem.name, type:mongoose.Schema.Types.ObjectId})
    @ApiProperty({type:[mongoose.Schema.Types.ObjectId]})
    todoItems: Array<ObjectId> = []
    @Prop({type:String})
    @ApiProperty()
    title: string
}

export class TodoListDto {
    @ApiProperty()
    title: string
}


export class TodoLists{
    @ApiProperty()
    todoList:Array<TodoList>
    constructor(todoList:Array<TodoList>) {
        this.todoList = todoList
    }
}

export type todoListDocument = HydratedDocument<TodoList>;
export const TodoListSchema = SchemaFactory.createForClass(TodoList);