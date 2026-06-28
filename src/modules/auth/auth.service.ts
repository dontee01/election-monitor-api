import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // const user = await this.usersService.create({
        //     ...dto,
        //     password: hashedPassword,
        // });

        const user = await this.usersService.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
        });

        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const matched = await bcrypt.compare(dto.password, user.password);

        if (!matched) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // const accessToken = await this.jwtService.signAsync(payload);
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        // return {
        //     accessToken,
        // };

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async refresh(
        refreshToken: string,
    ) {
        try {
            const payload =
                await this.jwtService.verifyAsync(
                    refreshToken,
                    {
                        secret:
                            this.configService.get(
                                'JWT_REFRESH_SECRET',
                            ),
                    },
                );

            const user =
                await this.usersService.findById(
                    payload.sub,
                );

            if (
                !user ||
                !user.refreshToken
            ) {
                throw new UnauthorizedException();
            }

            const matched =
                await bcrypt.compare(
                    refreshToken,
                    user.refreshToken,
                );

            if (!matched) {
                throw new UnauthorizedException();
            }

            const tokens =
                await this.generateTokens(
                    user.id,
                    user.email,
                    user.role,
                );

            return tokens;
        } catch {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);

        return {
            message: 'Logged out successfully'
        }
    }

    async generateTokens(
        userId: string,
        email: string,
        role: string,
    ) {
        const payload = {
            sub: userId,
            email,
            role,
        };
        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret:
                    this.configService.get(
                    'JWT_ACCESS_SECRET',
                    ),
                expiresIn:
                    this.configService.get(
                        'ACCESS_TOKEN_EXPIRES',
                    ),
            },
        );
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret:
                this.configService.get(
                    'JWT_REFRESH_SECRET',
                ),
            expiresIn:
                this.configService.get(
                    'REFRESH_TOKEN_EXPIRES',
                ),
        });

        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const hashedRefreshToken = refreshToken;

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: hashedRefreshToken,
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
