import {ApiProperty,} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class BaseTodoDto {
    userId
}

export class DeleteTodoListDto extends BaseTodoDto {
    @ApiProperty()
    id: string
    todoListId
}

export class CreateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    title: string
    userName: string
}

export class UpdateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string
    @ApiProperty()
    title: string
    todoListId
}

export class DeleteTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string
    todoListId
}

export class CreateTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    @IsNotEmpty()
    todoListId: string
    @ApiProperty()
    @IsNotEmpty()
    title: string
    @ApiProperty()
    @IsNotEmpty()
    description: string
    @ApiProperty()
    @IsNotEmpty()
    priority: number
}

export class UpdateTodoItemDto extends BaseTodoDto {
    @ApiProperty({type:String})
    @IsNotEmpty()
    id
    todoListId: string
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
    @ApiProperty()
    priority: number
}

export enum TodoCommands {
    LIST_CREATE, LIST_UPDATE, LIST_DELETE,
    ITEM_CREATE, ITEM_UPDATE, ITEM_DELETE
}

export class TodoEventMessage {
    method: TodoCommands
    payload: BaseTodoDto

    constructor(command: TodoCommands, data: BaseTodoDto) {
        this.method = command;
        this.payload = data;
    }
}