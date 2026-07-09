import { Controller, Get, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaginationDto } from '../../common/pagination/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: any, @Query() dto: PaginationDto) {
    // me(@Request() req: any) {
        // const user = req.user;
        return {
            message: "Profile fetched successfully",
            user
        };
    }

    @ApiBearerAuth()
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles(Role.ADMIN)
    @Get('dashboard')
    dashboard(@CurrentUser() user: any) {
        return user;
    }

}
