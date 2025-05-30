import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { ImagesController } from './images.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { ImagesModel } from './images.model'

@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [SequelizeModule.forFeature([ImagesModel])],
})
export class ImagesModule {}
