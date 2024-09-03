import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as nats from "ts-nats";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // const nc = await nats.connect({
    //     servers: ["nats://localhost:4222"],
    // })
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.NATS,
        options: {
            urls: [process.env.NATS_URL],  queue:'todo_queue'
        }
    });
    await app.startAllMicroservices()

    const config = new DocumentBuilder()
        .setTitle('todo list')
        .addBearerAuth({
            bearerFormat: "Bearer", in: "header", type: 'http', name: 'authorization'
        }, 'authorization')
        .setDescription('')
        .setVersion('1.0')
        .addTag('')
        .build();
    app.setGlobalPrefix('api')
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
    // await app.init()
    await app.listen(8080);
}
bootstrap();
