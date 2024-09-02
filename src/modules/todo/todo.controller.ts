import {
    Body, Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post, UseGuards,
} from "@nestjs/common";
import {ApiBearerAuth, ApiBody, ApiOkResponse} from "@nestjs/swagger";
import {AppContext, AppContextData} from "../auth/token/token.model";
import { TodoListDto, TodoLists} from "./todo.model";
import {TodoService} from "./todo.service";
import {CreateTodoListDto} from "./todo.dto.model";
import {Public, RolesGuard} from "../../config/guard/guard.auth";
import {Ctx, EventPattern, MessagePattern, NatsContext, Payload} from "@nestjs/microservices";

@Controller('todo')
@UseGuards(RolesGuard)
export class TodoController {
    constructor(private todoService:TodoService) {
    }

    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('authorization')
    @Get('list')
    @ApiOkResponse({type:TodoLists})
    async getUserUserData(@AppContext() appContext: AppContextData) {
      const todos =  await  this.todoService.getTodoLists(appContext.user.userName);
      return new TodoLists(todos)

    }

    @Post('list')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:TodoListDto })
    createTodoList( @Body() req: CreateTodoListDto, @AppContext() appContext: AppContextData) {
        req.userName = appContext.user.userName
        return this.todoService.createTodoListEvent(req);
    }

    @MessagePattern('todo.queue.list')
    @Public()
    async handleListCommands(@Payload() data: any, @Ctx() context: NatsContext) {
        console.log('Received message subject:', context.getSubject());
        console.log('Received message data:', data);
    }
    // @MessagePattern('todo.queue.list')
    // @Public()
    // async handleListCommands2(@Payload() data: any, @Ctx() context: NatsContext) {
    //     console.log('Received message 2 subject:', context.getSubject());
    //     console.log('Received message  2 data:', data);
    // }

    // @HttpCode(HttpStatus.OK)
    // @ApiBearerAuth('authorization')
    // @Delete('list')
    // deleteUserData(@AppContext() appContext: AppContextData) {
    //     return this.userService.deleteUserData(appContext.user.userName);
    // }

    // @HttpCode(HttpStatus.OK)
    // @ApiBearerAuth('authorization')
    // @Get('data/:code')
    // @ApiOkResponse({type:UserProduct})
    // async getUserUserDataByCode(@Param('code') code: string, @AppContext() appContext: AppContextData) {
    //     const products =  (await this.userService.getUserDataByCode(appContext.user.userName, code));
    //     if (products[0]) return products[0]
    //     else return []
    // }



}