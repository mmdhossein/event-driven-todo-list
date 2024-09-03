import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {SetMetadata} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {AppContextData} from "../../modules/auth/token/token.model";
import {UserService} from "../../modules/auth/users/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService, private userService:UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<string[]>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = RolesGuard.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const appContext = new AppContextData()

            appContext.user = await this.jwtService.verifyAsync(token, {
                secret: '!21ASsig_nmenT',
            });//UserAuthBody
            const user = await this.userService.findUser(appContext.user.userName)
            appContext.user._id = user._id
            request['AppContextData'] = appContext
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private static extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

export const IS_PUBLIC_KEY = 'isPublic';//meta data key
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);