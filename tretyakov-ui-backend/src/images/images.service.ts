import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import { InjectModel } from '@nestjs/sequelize'
import { ImagesModel } from './images.model'
import { createReadStream } from 'fs'
import { Response } from 'express'
import * as fsPromise from 'fs/promises'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Op } from 'sequelize'

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(ImagesModel) private imagesModel: typeof ImagesModel,
  ) {}

  async createNewRow(original_name, path) {
    return await this.imagesModel.create({
      original_name,
      path,
    })
  }

  async createFile({ buffer, originalname }: Express.Multer.File) {
    try {
      const uploadPath = path.resolve(__dirname, '..', 'static')
      const fileName: string = originalname
      const filePath = path.join(uploadPath, fileName)
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      fs.writeFileSync(filePath, buffer)
      const { id } = await this.createNewRow(originalname, filePath)
      return { id }
    } catch (e) {
      console.log(e)
      throw new HttpException(
        'Ошибка загрузки файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async create(image) {
    return await this.createFile(image)
  }

  async getRowById(id: string) {
    const row = await this.imagesModel.findOne({ where: { id } })
    try {
      if (!row || new Date(row.expires_at) < new Date()) {
        throw new HttpException(
          'Файл не найден, или его срок действия истек',
          HttpStatus.BAD_REQUEST,
        )
      }
      return row
    } catch (e) {
      console.log(e)
      throw new HttpException(
        'Файл не найден, или его срок действия истек',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async getImage(id: string, canDelete: string, res: Response) {
    const fileInfo = await this.getRowById(id)
    if (canDelete) {
      res.on('finish', async () => {
        try {
          await fsPromise.rm(fileInfo.path, { force: true })
          await fileInfo.destroy()
          console.log(`Файл ${id} успешно удален`)
        } catch (deleteError) {
          console.error('Ошибка при удалении файла:', deleteError)
        }
      })
    }

    try {
      const fileStream = createReadStream(fileInfo.path)

      fileStream.on('error', (err) => {
        if (!res.headersSent) {
          console.log(err)
          return res
            .status(HttpStatus.NOT_FOUND)
            .send('Файл не найден на сервере')
        }
      })

      res.setHeader('X-Created-At', fileInfo.created_at)
      res.setHeader('X-expires-At', fileInfo.expires_at)
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileInfo.original_name}"`,
      )

      fileStream.pipe(res)
    } catch (err) {
      console.error(err)
      throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST)
    }
  }

  async getImageInfo(id: string) {
    const { original_name, created_at, expires_at } = await this.getRowById(id)
    return {
      name: original_name,
      createdAt: created_at,
      expires_at: expires_at,
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredFiles() {
    const expiredFiles = await this.imagesModel.findAll({
      where: { expires_at: { [Op.lt]: new Date() } },
    })

    for (const file of expiredFiles) {
      try {
        await fsPromise.rm(file.path)
        await file.destroy()
      } catch (e) {
        console.error(`Error deleting file ${file.id}:`, e)
      }
    }
  }
}
