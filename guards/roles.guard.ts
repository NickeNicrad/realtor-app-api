import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';

import { ROLES_KEY } from 'decorators/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
      

        if (!roles) {
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const payload = request?.user;

        if (payload) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload?.id
                }
            })
    
            return this.matchRoles(roles, user.user_type);
        }

        return false;
    }

    private matchRoles(roles: UserType [], userRole: UserType): boolean {
        if (roles?.includes(userRole))
            return true
        return false
    }
}