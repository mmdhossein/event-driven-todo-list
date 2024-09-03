import {ApiProperty} from "@nestjs/swagger";

export class BaseTodoDto {
    userId
}

export class DeleteTodoListDto extends BaseTodoDto {
    @ApiProperty()
    id: string
}

export class CreateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    title: string
    userName: string
}

export class UpdateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    title: string
}

export class DeleteTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    todoListId
}

export class CreateTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    todoListId: string
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
    @ApiProperty()
    priority: number
}

export class UpdateTodoItemDto extends CreateTodoItemDto {
    id
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