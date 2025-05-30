import {
  Get,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  Query,
} from '@nestjs/common'
import { ImagesService } from './images.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  addNew(@UploadedFile() image: Express.Multer.File) {
    return this.imagesService.create(image)
  }

  @Get(':id')
  getImage(
    @Param('id') id: string,
    @Query('delete') canDelete: string,
    @Res() res: Response,
  ) {
    return this.imagesService.getImage(id, canDelete, res)
  }

  @Get('info/:id')
  getImageInfo(@Param('id') id: string) {
    return this.imagesService.getImageInfo(id)
  }
}
