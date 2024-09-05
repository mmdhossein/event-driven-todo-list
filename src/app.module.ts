import {Global, Module} from '@nestjs/common';
import {databaseProviders} from "./config/db/db.provider";
import {modelProviders} from "./config/db/models.provider";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./modules/auth/auth.module";
import {TodoModule} from "./modules/todo/todo.module";
import {QueueModule} from "./modules/queue/queue.module";
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: './env/.alpha.env',
        }).module,AuthModule,TodoModule,QueueModule,
    ],
    controllers: [],
    providers: [...databaseProviders,...modelProviders],
    exports:[...databaseProviders,...modelProviders]
})
export class AppModule {
}
