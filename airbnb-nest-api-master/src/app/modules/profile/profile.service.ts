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
import { AppResponse } from '../../../utils/shared.types'
import {
   AnnouncementSortingFields,
   BookingsSortingFields,
} from './profile.types'

import { BookingEntity, ListingEntity, UserEntity } from '../../entities'
import { BookTheListingDto } from '../listing/listing.dto'

@Injectable()
export class ProfileService {
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

   async getProfile(userId: string): Promise<AppResponse<UserEntity>> {
      try {
         const user = await this.userRepo.findOne(userId)

         if (!user) {
            throw new NotFoundException('Profile not found.')
         }

         return { data: user }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getListingById(
      listingId: string,
   ): Promise<AppResponse<ListingEntity>> {
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

   async getBookingById(
      bookingId: string,
   ): Promise<AppResponse<BookingEntity>> {
      try {
         const booking = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.listing', 'listing')
            .leftJoinAndSelect('booking.user', 'bookingUser')
            .leftJoinAndSelect('listing.images', 'listingImage')
            .leftJoinAndSelect('listingImage.image', 'image')
            .leftJoinAndSelect('listing.user', 'listingUser')
            .leftJoinAndSelect('listing.feedbacks', 'feedback')
            .leftJoinAndSelect('listing.bookings', 'listingBookings')
            .where('booking.id = :bookingId', {
               bookingId,
            })
            .getOne()

         if (!booking) {
            throw new NotFoundException('Booking not found.')
         }

         return { data: booking }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getUserAnnouncements(
      userId: string,
      page = 0,
      limit = 10,
      sortingFields: AnnouncementSortingFields,
   ): Promise<AppResponse<ListingEntity[]>> {
      try {
         const qb = await this.listingRepo
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.region', 'region')
            .leftJoinAndSelect('listing.images', 'listingImage')
            .leftJoinAndSelect('listingImage.image', 'image')
            .leftJoinAndSelect('listing.user', 'user')

         await qb.andWhere('listing.userId = :userId', {
            userId,
         })

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

   async getUserBookings(
      userId: string,
      page = 0,
      limit = 10,
      sortingFields: BookingsSortingFields,
   ): Promise<AppResponse<BookingEntity[]>> {
      try {
         const qb = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.listing', 'listing')
            .leftJoinAndSelect('listing.region', 'region')
            .leftJoinAndSelect('listing.images', 'listingImage')
            .leftJoinAndSelect('listingImage.image', 'image')

         await qb.andWhere('booking.userId = :userId', {
            userId,
         })

         if (sortingFields.createdAt) {
            await qb.addOrderBy('booking.createdAt', sortingFields.createdAt)
         }

         if (sortingFields.updatedAt) {
            await qb.addOrderBy('booking.updatedAt', sortingFields.updatedAt)
         }

         const [bookings, total] = await qb
            .skip(page > 0 ? (page - 1) * limit : 0)
            .take(limit)
            .getManyAndCount()

         return { data: bookings, total }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async changeBookingDates(
      data: BookTheListingDto,
      bookingId: string,
   ): Promise<AppResponse<BookingEntity>> {
      try {
         const booking = await this.bookingRepo.findOne(bookingId)
         booking.checkInDate = data.checkInDate
         booking.checkOutDate = data.checkoutDate
         booking.amount = data.amount
         await booking.save()

         return {
            data: booking,
            message: 'You have successfully changed your booking dates.',
         }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }
}
