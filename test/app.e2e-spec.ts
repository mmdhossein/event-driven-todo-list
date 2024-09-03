import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {AuthModule} from "../src/modules/auth/auth.module";
import {TodoModule} from "../src/modules/todo/todo.module";
import {QueueModule} from "../src/modules/queue/queue.module";

describe('login controller (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, AuthModule,TodoModule,QueueModule,],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/token/register (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/token/register').send({userName: 'hossein', password: '123'})
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty('access_token')


    });

    afterAll(async () => {
      await app.close();
    });
});
