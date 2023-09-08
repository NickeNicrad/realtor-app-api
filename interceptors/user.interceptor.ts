import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import optionsJWT from "functions/optionsJWT";
import { Observable } from "rxjs";

export class UserInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        const decoded = await optionsJWT.verifyJWT(token);

        request['user'] = decoded;

        return next.handle();
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
