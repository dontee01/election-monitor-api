import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        config.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    // const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    // console.log('User found in JWT strategy:', ".....");
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // // delete user.password;
    // return user;
    try {
      // console.log('JWT payload:', payload);

      // return await this.authService.validateUserById(payload.sub);
      // return {
      //   id: payload.sub,
      //   email: payload.email,
      //   role: payload.role,
      // };

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return null;
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
    } catch (error) {
      console.error('Error validating JWT:', error);
      return null;
    }
  }
}