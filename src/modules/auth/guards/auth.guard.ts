import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Request } from 'express';
import { AuthService } from "../auth.service";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: AuthService;

  constructor(private jwtService: JwtService, private moduleRef: ModuleRef) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    if (!this.authService)
      this.authService = this.moduleRef.get(AuthService, { strict: false });

    if (!token)
      throw new UnauthorizedException('Token manquant ou invalide.');


    try {
      if (this.authService.isBlacklisted(token)) {
        const err: any = new Error('Déconnexion simulée');
        err.name = 'TokenBlacklistedError';
        throw err;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
    } catch (error) {
      if (error?.name === 'TokenBlacklistedError') {
        throw new UnauthorizedException('Déconnexion simulée.');
      } else {
        throw new UnauthorizedException('Token invalide ou expiré.');
      }
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, tokenFromHeader] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && tokenFromHeader) return tokenFromHeader;

    const tokenFromCookie = request.cookies?.['jwt'];
    return tokenFromCookie;
  }
}
