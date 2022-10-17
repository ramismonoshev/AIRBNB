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
import { AnnouncementSortingFields, BookingsSortingFields } from './users.types'

import { BookingEntity, ListingEntity, UserEntity } from '../../entities'

@Injectable()
export class UsersService {
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

   async getAllUsers(): Promise<AppResponse<UserEntity[]>> {
      try {
         const users = await this.userRepo.find({
            relations: ['bookings', 'listings'],
         })

         const responseUsers = []

         users.forEach(({ bookings, listings, ...user }) => {
            responseUsers.push({
               user,
               bookings: bookings.length,
               announcements: listings.length,
            })
         })

         return { data: responseUsers }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async getProfile(
      userId: string,
   ): Promise<
      AppResponse<{ user: UserEntity; isAllAnnouncementsAreBlocked: boolean }>
   > {
      try {
         const user = await this.userRepo.findOne(userId, {
            relations: ['listings'],
         })

         if (!user) {
            throw new NotFoundException('User not found.')
         }

         const isAllAnnouncementsAreBlocked = user.listings.every(
            (b) => b.isBlocked === true,
         )

         return { data: { user, isAllAnnouncementsAreBlocked } }
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

   async blockAll(userId: string): Promise<AppResponse> {
      try {
         const listings = await this.listingRepo.find({
            where: { user: await this.userRepo.findOne(userId) },
         })

         await Promise.all(
            listings.map((listing) => {
               listing.isBlocked = true
               return listing.save()
            }),
         )

         return { message: 'All listings of user are blocked' }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async unBlockAll(userId: string): Promise<AppResponse> {
      try {
         const listings = await this.listingRepo.find({
            where: { user: await this.userRepo.findOne(userId) },
         })

         await Promise.all(
            listings.map((listing) => {
               listing.isBlocked = false
               return listing.save()
            }),
         )

         return { message: 'All listings of user are blocked' }
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
}
