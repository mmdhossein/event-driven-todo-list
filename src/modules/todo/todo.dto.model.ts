import {ApiProperty} from "@nestjs/swagger";

export class BaseTodoDto {

}

export class DeleteTodoListDto extends BaseTodoDto {
    @ApiProperty()
    id:string
}

export class CreateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    title:string
    userName:string
    userId
}

export class UpdateTodoListDto extends BaseTodoDto {
    @ApiProperty()
    id:string
    @ApiProperty()
    title:string
}

export class DeleteTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    id:string
}

export class CreateTodoItemDto extends BaseTodoDto {
    @ApiProperty()
    todoListId:string
    @ApiProperty()
    title:string
    @ApiProperty()
    description:string
    @ApiProperty()
    priority:string
}

export class UpdateTodoItemDto extends BaseTodoDto {

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