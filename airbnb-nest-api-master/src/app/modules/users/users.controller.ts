import { Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { AppResponse, AppRoles } from '../../../utils/shared.types'
import { BookingEntity, ListingEntity, UserEntity } from '../../entities'
import { Auth } from '../../shared/decorators/auth.decorator'
import { AnnouncementSortingFields, BookingsSortingFields } from './users.types'

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Auth([AppRoles.ADMIN])
   @Get(':id/profile')
   getUserProfile(
      @Param('id') id: string,
   ): Promise<
      AppResponse<{ user: UserEntity; isAllAnnouncementsAreBlocked: boolean }>
   > {
      return this.usersService.getProfile(id)
   }

   @Auth([AppRoles.ADMIN])
   @Get()
   getAllUsers(): Promise<AppResponse<UserEntity[]>> {
      return this.usersService.getAllUsers()
   }

   @Auth([AppRoles.ADMIN])
   @Get('announcements/:id')
   getAnnouncementById(
      @Param('id') id: string,
   ): Promise<AppResponse<ListingEntity>> {
      return this.usersService.getById(id)
   }

   @Auth([AppRoles.ADMIN])
   @Get('bookings/:id')
   getBookingById(
      @Param('id') id: string,
   ): Promise<AppResponse<ListingEntity>> {
      return this.usersService.getById(id)
   }

   @Auth([AppRoles.ADMIN])
   @Get(':id/announcements')
   getAnnouncements(
      @Param('id') userId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
   ): Promise<AppResponse<ListingEntity[]>> {
      let sortingFields: AnnouncementSortingFields = {}

      if (sortBy) {
         sortingFields = JSON.parse(sortBy)
      }

      return this.usersService.getUserAnnouncements(
         userId,
         page,
         limit,
         sortingFields,
      )
   }

   @Auth([AppRoles.ADMIN])
   @Get(':id/bookings')
   getBookings(
      @Param('id') userId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
   ): Promise<AppResponse<BookingEntity[]>> {
      let sortingFields: BookingsSortingFields = {}

      if (sortBy) {
         sortingFields = JSON.parse(sortBy)
      }

      return this.usersService.getUserBookings(
         userId,
         page,
         limit,
         sortingFields,
      )
   }

   @Auth([AppRoles.ADMIN])
   @Patch(':id/blockAllAnnouncements')
   blockAll(@Param('id') id: string): Promise<AppResponse> {
      return this.usersService.blockAll(id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch(':id/unBlockAllAnnouncements')
   unBlockAll(@Param('id') id: string): Promise<AppResponse> {
      return this.usersService.unBlockAll(id)
   }
}
