import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: {
        fullName: string;
        email: string;
        password: string;
    }){
        return this.prisma.user.create({
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    
    async updateRefreshToken(
        userId: string,
        refreshToken: string | null,
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken,
            },
        });
    }

}
