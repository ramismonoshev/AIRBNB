import { EntityRepository, Repository } from 'typeorm'
import { ImageEntity } from '../entities'
import { config } from '../config/app.config'
import { MulterFile } from '../../utils/shared.types'
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { FileService } from '../shared/services/file.service'
import { IMAGE_RESIZE_OPTIONS, IMAGE_SIZE } from '../../utils/constants'

@EntityRepository(ImageEntity)
export class ImageRepository extends Repository<ImageEntity> {
   private fileService = new FileService()

   async deleteOldImg(oldImage: ImageEntity): Promise<void> {
      this.fileService.deleteFile(oldImage.largeImagePath)
      this.fileService.deleteFile(oldImage.smallImagePath)

      await oldImage.remove()
   }

   async updateImg(
      oldImg?: ImageEntity,

      newImgId?: string,
   ): Promise<ImageEntity> | null {
      if (newImgId) {
         const newImg = await this.findOne({ id: newImgId })

         if (!newImg) {
            throw new HttpException('Image not found', HttpStatus.NOT_FOUND)
         }

         if (oldImg && oldImg.id !== newImg.id) {
            await this.deleteOldImg(oldImg)
         }

         return newImg
      }

      if (!newImgId) {
         if (oldImg) {
            await this.deleteOldImg(oldImg)
         }

         return null
      }
   }

   async upload(
      file: MulterFile,

      folderName: string,

      validExtensions: string[],
   ): Promise<ImageEntity> {
      if (!this.fileService.isValidFileExtension(file, validExtensions)) {
         throw new BadRequestException(`Invalid image file extension.`)
      }

      const [largeImageName, largeImagePath] =
         await this.fileService.processImageUpload(
            file,

            `${config.UPLOAD_IMAGES_DIR}/${folderName}`,

            IMAGE_RESIZE_OPTIONS[IMAGE_SIZE.LARGE],
         )

      const [smallImageName, smallImagePath] =
         await this.fileService.processImageUpload(
            file,

            `${config.UPLOAD_IMAGES_DIR}/${folderName}`,

            IMAGE_RESIZE_OPTIONS[IMAGE_SIZE.SMALL],
         )

      const image = this.create()

      image.smallImageName = smallImageName
      image.smallImagePath = smallImagePath

      image.largeImageName = largeImageName
      image.largeImagePath = largeImagePath

      return await image.save()
   }
}
