import {Test} from "@nestjs/testing";
import {TokenService} from "./service/token.service";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../users/service/user.service";
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import beforeEach from "node:test";
const moduleMocker = new ModuleMocker(global);

describe('TokenController', () => {
    let tokenService: TokenService;

    beforeEach(async () => {
        jest.resetModules()
        process.env.JWT_SECRET = '!21ASsig_nmenT'
        const moduleRef = await Test.createTestingModule({
            providers: [TokenService,JwtService],
        })
            .useMocker((token) => {
                if (token === UserService) {
                    return { findUser: jest.fn().mockResolvedValue({
                            password:'$2b$10$oz/RU.Tf6at2S2Hy/9wak.Ovx3CTnydF/u9LqnQHlW/CVqGZMQ4H.',username:'hossein'
                    }) };
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                    return new Mock();
                }
            })
            .compile();

        tokenService = moduleRef.get(TokenService);

    });
    describe('login',  ()=>{
        it('should give access_token', async function () {
            await expect(await tokenService.login('hossein', '123')).toHaveProperty('access_token')
        });
    })

});