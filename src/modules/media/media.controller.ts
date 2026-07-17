import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';

import { Role } from '../../common/enums/role.enum';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { MediaCommandService } from './commands/media-command.service';
import { MediaQueryService } from './queries/media-query.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtUser } from 'src/common/types/jwt-user.type';
import { QueryMediaDto } from './dto/query-media.dto';
import { Multer } from 'multer';
import { CustomFileExtensionValidator } from 'src/shared/validators/ccustom-file-extension-validator';

@ApiBearerAuth()
@ApiTags('Media')
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly commandService: MediaCommandService,
    private readonly queryService: MediaQueryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
        new CustomFileExtensionValidator({
          allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mp3', '.wav', '.aac', '.pdf']
        })
      ],
    }),
  )
  file: Express.Multer.File,
  @Body() dto: UploadMediaDto,
  @CurrentUser() user: any,
  ) {
    return this.commandService.upload(
      file,
      dto,
      user.id,
    );
  }

  @Get()
  findAll(@Query() dto: QueryMediaDto) {
    return this.queryService.findAll(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.queryService.findOne(id);
  }
}