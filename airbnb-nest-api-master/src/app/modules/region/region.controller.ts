import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Req,
   UploadedFile,
   UseInterceptors,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common'
import { RegionService } from './region.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppResponse, MulterFile } from '../../../utils/shared.types'
import { UploadedImageResponse } from './region.types'
import { RegionEntity } from '../../entities'
import { RegionDto } from './region.dto'

@Controller('regions')
export class RegionController {
   constructor(private readonly regionService: RegionService) {}

   @Post('')
   @UsePipes(ValidationPipe)
   create(
      @Req() req,
      @Body() data: RegionDto,
   ): Promise<AppResponse<RegionEntity>> {
      return this.regionService.create(data)
   }

   @Get('')
   getAll(): Promise<AppResponse<RegionEntity[]>> {
      return this.regionService.getAll()
   }

   @Delete(':id')
   delete(@Param('id') id: string): Promise<AppResponse<RegionEntity[]>> {
      return this.regionService.delete(id)
   }

   @Post('upload/image')
   @UseInterceptors(FileInterceptor('image'))
   uploadImage(
      @UploadedFile() file: MulterFile,
   ): Promise<UploadedImageResponse> {
      return this.regionService.uploadImage(file)
   }
}
