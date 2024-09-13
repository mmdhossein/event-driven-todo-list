import {
    Body, Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post, Put, UseGuards,
} from "@nestjs/common";
import {ApiBearerAuth, ApiBody, ApiOkResponse} from "@nestjs/swagger";
import {AppContext, AppContextData} from "../../auth/token/model/token.model";
import { TodoLists} from "../model/todo.model";
import {TodoService} from "../service/todo.service";
import {
    CreateTodoItemDto,
    CreateTodoListDto, DeleteTodoItemDto, DeleteTodoListDto,
    TodoEventMessage,
    UpdateTodoItemDto,
    UpdateTodoListDto
} from "../model/todo.dto.model";
import {Public, RolesGuard} from "../../../config/guard/guard.auth";
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
      const todos =  await  this.todoService.getTodoLists(appContext.user._id);
      return new TodoLists(todos)

    }

    @Post('list')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:CreateTodoListDto })
    createTodoList( @Body() req: CreateTodoListDto, @AppContext() appContext: AppContextData) {
        req.userName = appContext.user.userName
        return this.todoService.createTodoListEvent(req, appContext.user._id);
    }

    @Put('list')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:UpdateTodoListDto })
    updateTodoList( @Body() req: UpdateTodoListDto, @AppContext() appContext: AppContextData) {
        return this.todoService.updateTodoListEvent(req, appContext.user._id);
    }

    @Delete('list')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:DeleteTodoListDto })
    deleteTodoList( @Body() req: DeleteTodoListDto,@AppContext() appContext: AppContextData) {
        return this.todoService.deleteTodoListEvent(req, appContext.user._id);
    }

    @Post('item')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:CreateTodoItemDto })
    createItemList( @Body() req: CreateTodoItemDto, @AppContext() appContext: AppContextData) {
        return this.todoService.createItemEvent(req, appContext.user._id);
    }

    @Put('item')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:UpdateTodoItemDto })
    updateItemList( @Body() req: UpdateTodoItemDto, @AppContext() appContext: AppContextData) {
        return this.todoService.updateItemEvent(req, appContext.user._id);
    }

    @Delete('item')
    @ApiBearerAuth('authorization')
    @ApiOkResponse({status:201})
    @ApiBody({
        type:DeleteTodoItemDto })
    deleteItemList( @Body() req: DeleteTodoItemDto,@AppContext() appContext: AppContextData) {
        return this.todoService.deleteItemEvent(req, appContext.user._id);
    }
    @EventPattern('todo_queue')
    @Public()
    async handleCommands(@Payload() req: TodoEventMessage, @Ctx() context: NatsContext) {
        console.log('Received message subject:', context.getSubject());
        console.log('Received message data:', req);
        await this.todoService.processCommand(req.payload, req.method)
    }
}