import { Connection } from 'mongoose';
import {User, UserSchema} from "../../modules/auth/users/user.model";
import {TodoItem, TodoItemSchema, TodoList, TodoListSchema} from "../../modules/todo/todo.model";

export const modelProviders = [
    {
        provide: User.name,
        useFactory: (connection: Connection) => connection.model(User.name, UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: TodoItem.name,
        useFactory: (connection: Connection) => connection.model(TodoItem.name, TodoItemSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: TodoList.name,
        useFactory: (connection: Connection) => connection.model(TodoList.name, TodoListSchema),
        inject: ['DATABASE_CONNECTION'],
    },


];