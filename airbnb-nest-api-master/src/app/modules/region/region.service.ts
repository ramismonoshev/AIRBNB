import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'

import {
   ImageRepository,
   RegionRepository,
   UserRepository,
} from '../../repositories'
import { AppResponse, MulterFile } from '../../../utils/shared.types'
import { UploadedImageResponse } from './region.types'
import { config } from '../../config/app.config'
import { RegionEntity } from '../../entities'
import { RegionDto } from './region.dto'

@Injectable()
export class RegionService {
   constructor(
      private readonly userRepo: UserRepository,
      private readonly logger: Logger,
      private readonly imageRepo: ImageRepository,
      private readonly regionRepo: RegionRepository,
   ) {}

   async create(data: RegionDto): Promise<AppResponse<RegionEntity>> {
      try {
         const region = this.regionRepo.create()
         region.title = data.title
         region.longitude = data.longitude
         region.latitude = data.latitude
         region.image = await this.imageRepo.findOne(data.image)

         await region.save()

         return { data: region, message: 'Region successfully created.' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getAll(): Promise<AppResponse<RegionEntity[]>> {
      try {
         const regions = await this.regionRepo.find()

         return { data: regions }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async delete(id: string): Promise<AppResponse> {
      try {
         const region = await this.regionRepo.findOne(id)
         if (!region) {
            throw new HttpException('Region not found.', HttpStatus.NOT_FOUND)
         }

         await region.remove()
         await region.image.remove()
         await this.imageRepo.deleteOldImg(region.image)

         return { message: 'Region successfully deleted.' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async uploadImage(file: MulterFile): Promise<UploadedImageResponse> {
      try {
         const image = await this.imageRepo.upload(
            file,
            config.LISTING_IMAGES_DIR_NAME,
            ['jpeg', 'png', 'gif'],
         )

         return { imageId: image.id }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }
}
