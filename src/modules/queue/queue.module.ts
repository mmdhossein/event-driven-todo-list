import {Module} from "@nestjs/common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {QueueNatsService, QueueService} from "./service/queue.service";

@Module({
    imports: [ClientsModule.register([
        {
            name: 'NATS_SERVICE',
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_URL],queue:'todo'
            },
        },
    ]),], providers:[QueueService,QueueNatsService],exports:[QueueService]
})
export class QueueModule {

}