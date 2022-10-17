import { Injectable, Logger, NotFoundException } from '@nestjs/common'

import {
   BookingRepository,
   FeedbackImageRepository,
   FeedbackRepository,
   ImageRepository,
   ListingImageRepository,
   ListingRepository,
   RegionRepository,
   UserRepository,
} from '../../repositories'
import { AppResponse, MulterFile } from '../../../utils/shared.types'
import {
   ListingFilterFields,
   ListingSortingFields,
   UploadedImageResponse,
} from './listing.types'
import { config } from '../../config/app.config'
import {
   BookTheListingDto,
   CreateListingDto,
   LeaveFeedbackDto,
} from './listing.dto'
import {
   BookingEntity,
   FeedbackEntity,
   ListingEntity,
   ListingStatus,
} from '../../entities'
import { replaceWhiteSpacesWith } from '../../../utils/helpers'

@Injectable()
export class ListingService {
   constructor(
      private readonly userRepo: UserRepository,
      private readonly logger: Logger,
      private readonly imageRepo: ImageRepository,
      private readonly listingRepo: ListingRepository,
      private readonly listingImageRepo: ListingImageRepository,
      private readonly feedbackRepo: FeedbackRepository,
      private readonly feedbackImageRepo: FeedbackImageRepository,
      private readonly regionRepo: RegionRepository,
      private readonly bookingRepo: BookingRepository,
   ) {}

   async create(
      data: CreateListingDto,
      hostId: string,
   ): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = new ListingEntity()
         listing.title = data.title
         listing.description = data.description
         listing.address = data.address
         listing.type = data.type
         listing.price = data.price
         listing.maxNumberOfGuests = data.maxNumberOfGuests

         listing.user = await this.userRepo.findOne(hostId)
         listing.region = await this.regionRepo.findOne(data.regionId)

         await listing.save()

         await Promise.all(
            data.images.map(async (id) => {
               const listingImage = this.listingImageRepo.create()
               listingImage.listing = listing
               listingImage.image = await this.imageRepo.findOne(id)
               return listingImage.save()
            }),
         )

         return { data: listing, message: 'Listing successfully created.' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async update(
      data: CreateListingDto,
      listingId: string,
   ): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)

         if (!listing) {
            throw new NotFoundException('Listing not found')
         }

         const region = await this.regionRepo.findOne(data.regionId)

         listing.title = data.title
         listing.description = data.description
         listing.address = data.address
         listing.type = data.type
         listing.price = data.price
         listing.maxNumberOfGuests = data.maxNumberOfGuests
         listing.region = region

         await listing.save()
         const oldImagesToBeDeleted = listing.images.filter((oldListingImg) => {
            return !data.images.includes(oldListingImg.image.id)
         })

         await Promise.all(
            oldImagesToBeDeleted.map(async (oldListingImage) => {
               await oldListingImage.remove()
               await this.imageRepo.deleteOldImg(oldListingImage.image)
            }),
         )

         const newImages = data.images.filter((reqImage) => {
            if (listing.images.find((oldImg) => oldImg.image.id === reqImage)) {
               return false
            }

            return true
         })

         await Promise.all(
            newImages.map(async (requestImgId) => {
               const listingImage = this.listingImageRepo.create()
               listingImage.listing = listing
               const image = await this.imageRepo.findOne(requestImgId)

               listingImage.image = image
               return listingImage.save()
            }),
         )

         console.log('oldImageIdsToBeDeleted', oldImagesToBeDeleted)

         // listing.images = newListingImages

         return { data: listing, message: 'Listing successfully updated.' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getById(listingId: string): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId, {
            relations: ['feedbacks', 'bookings'],
         })

         if (!listing) {
            throw new NotFoundException('Listing not found.')
         }

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async acceptListingApplication(
      listingId: string,
   ): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)
         if (!listing) {
            throw new NotFoundException('Application not found.')
         }

         listing.status = ListingStatus.ACCEPTED

         await listing.save()

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async rejectListingApplication(
      listingId: string,
   ): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)
         if (!listing) {
            throw new NotFoundException('Application not found.')
         }

         listing.status = ListingStatus.REJECTED

         await listing.save()

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async blockListing(listingId: string): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)
         if (!listing) {
            throw new NotFoundException('Listing not found.')
         }

         listing.isBlocked = true

         await listing.save()

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async unBlockListing(
      listingId: string,
   ): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)
         if (!listing) {
            throw new NotFoundException('Listing not found.')
         }

         listing.isBlocked = false

         await listing.save()

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async markAsViewed(listingId: string): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)
         if (!listing) {
            throw new NotFoundException('Listing not found.')
         }

         listing.isViewed = true

         await listing.save()

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async delete(listingId: string): Promise<AppResponse<ListingEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId, {
            relations: ['feedbacks', 'bookings'],
         })

         await Promise.all(
            listing.feedbacks.map(async (feedback) => feedback.remove()),
         )

         await Promise.all(
            listing.bookings.map(async (booking) => booking.remove()),
         )
         if (!listing) {
            throw new NotFoundException('Listing not found.')
         }

         await listing.remove()
         await Promise.all(
            listing.images.map(async (listingImage) => {
               return this.imageRepo.deleteOldImg(listingImage.image)
            }),
         )

         return { data: listing }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getAll(
      page = 0,
      limit = 10,
      sortingFields: ListingSortingFields,
      filterFields: ListingFilterFields,
   ): Promise<AppResponse<ListingEntity[]>> {
      try {
         const qb = await this.listingRepo
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.region', 'region')
            .leftJoinAndSelect('listing.images', 'listingImage')
            .leftJoinAndSelect('listingImage.image', 'image')
            .leftJoinAndSelect('listing.user', 'user')

         if (sortingFields.price) {
            await qb.addOrderBy('listing.price', sortingFields.price)
         }

         if (sortingFields.createdAt) {
            await qb.addOrderBy('listing.createdAt', sortingFields.createdAt)
         }

         if (sortingFields.updatedAt) {
            await qb.addOrderBy('listing.updatedAt', sortingFields.updatedAt)
         }

         if (sortingFields.isBlocked) {
            await qb.addOrderBy('listing.isBlocked', sortingFields.isBlocked)
         }

         if (sortingFields.isViewed) {
            await qb.addOrderBy('listing.isViewed', sortingFields.isViewed)
         }

         if (sortingFields.popular) {
            await qb.orderBy('listing.rating', sortingFields.popular)
         }

         if (filterFields.regionIds) {
            await qb.andWhere('listing.regionId IN (:...regionIds)', {
               regionIds: filterFields.regionIds,
            })
         }

         if (filterFields.title) {
            const searchText = replaceWhiteSpacesWith(filterFields.title, '%')
            await qb.andWhere('listing.title ILIKE :title', {
               title: `%${searchText}%`,
            })
         }

         if (filterFields.type) {
            await qb.andWhere('listing.type = :type', {
               type: filterFields.type,
            })
         }

         if (filterFields.status) {
            await qb.andWhere('listing.status = :status', {
               status: filterFields.status,
            })
         }

         if (filterFields.search) {
            const searchText = replaceWhiteSpacesWith(filterFields.search, '%')
            await qb
               .andWhere('listing.address ILIKE :address', {
                  address: `%${searchText}%`,
               })
               .orWhere('listing.title ILIKE :title', {
                  title: `%${searchText}%`,
               })
               .orWhere('region.title ILIKE :regionTitle', {
                  regionTitle: `%${searchText}%`,
               })
               .orWhere('listing.town ILIKE :town', {
                  town: `%${searchText}%`,
               })
               .orWhere('listing.description ILIKE :description', {
                  description: `%${searchText}%`,
               })
         }

         const [listings, total] = await qb
            .skip(page > 0 ? (page - 1) * limit : 0)
            .take(limit)
            .getManyAndCount()

         return { data: listings, total }
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

   async uploadFeedbackImage(file: MulterFile): Promise<UploadedImageResponse> {
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

   async leaveFeedback(
      data: LeaveFeedbackDto,
      userId: string,
      listingId: string,
   ): Promise<AppResponse<FeedbackEntity>> {
      try {
         const listing = await this.listingRepo.findOne(listingId)

         const feedback = new FeedbackEntity()
         feedback.rating = data.rating
         feedback.comment = data.comment
         feedback.listing = listing
         feedback.user = await this.userRepo.findOne(userId)

         await feedback.save()

         await Promise.all(
            data.images.map(async (id) => {
               const feedbackImage = this.feedbackImageRepo.create()
               feedbackImage.feedback = feedback
               feedbackImage.image = await this.imageRepo.findOne(id)
               return feedbackImage.save()
            }),
         )

         const [listingFeedbacks, listingFeedbacksCount] =
            await this.feedbackRepo.findAndCount()

         const ratingsTotal = listingFeedbacks.reduce(
            (accumulator, feedback) => accumulator + feedback.rating,
            0,
         )

         const averageRating = ratingsTotal / listingFeedbacksCount
         // const averageRating =
         //    (ratingsTotal + data.rating) / (listingFeedbacksCount + 1)
         listing.rating = Number(averageRating.toFixed(1))
         await listing.save()

         return { data: feedback, message: 'Feedback successfully saved.' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async bookTheListing(
      data: BookTheListingDto,
      userId: string,
      listingId: string,
   ): Promise<AppResponse<BookingEntity>> {
      try {
         const listing = await await this.listingRepo.findOne(listingId)

         const booking = this.bookingRepo.create()
         booking.checkInDate = data.checkInDate
         booking.checkOutDate = data.checkoutDate
         booking.amount = data.amount
         booking.listing = listing
         booking.user = await this.userRepo.findOne(userId)

         await booking.save()

         return {
            data: booking,
            message: 'You have successfully booked your trip.',
         }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }
}
