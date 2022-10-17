import {
   Body,
   Controller,
   Get,
   Param,
   Patch,
   Post,
   Query,
   Req,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { AppResponse, AppRoles } from '../../../utils/shared.types'
import { BookingEntity, ListingEntity, UserEntity } from '../../entities'
import { Auth } from '../../shared/decorators/auth.decorator'
import {
   AnnouncementSortingFields,
   BookingsSortingFields,
} from './profile.types'
import { BookTheListingDto } from '../listing/listing.dto'

@Controller('profile')
export class ProfileController {
   constructor(private readonly profileService: ProfileService) {}

   @Auth([AppRoles.USER])
   @Get('me')
   getUserProfile(@Req() req): Promise<AppResponse<UserEntity>> {
      return this.profileService.getProfile(req.user.id)
   }

   @Auth([AppRoles.USER])
   @Get('announcements/:id')
   getAnnouncementById(
      @Param('id') id: string,
   ): Promise<AppResponse<ListingEntity>> {
      return this.profileService.getListingById(id)
   }

   @Auth([AppRoles.USER])
   @Get('bookings/:id')
   getBookingById(
      @Param('id') id: string,
   ): Promise<AppResponse<BookingEntity>> {
      return this.profileService.getBookingById(id)
   }

   @Auth([AppRoles.USER])
   @Patch('bookings/:id/changeDates')
   @UsePipes(ValidationPipe)
   changeBookingDates(
      @Req() req,
      @Param('id') bookingId: string,
      @Body() data: BookTheListingDto,
   ): Promise<AppResponse<BookingEntity>> {
      return this.profileService.changeBookingDates(data, bookingId)
   }

   @Auth([AppRoles.USER])
   @Get('announcements')
   getAnnouncements(
      @Req() req,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
   ): Promise<AppResponse<ListingEntity[]>> {
      let sortingFields: AnnouncementSortingFields = {}

      if (sortBy) {
         sortingFields = JSON.parse(sortBy)
      }

      return this.profileService.getUserAnnouncements(
         req.user.id,
         page,
         limit,
         sortingFields,
      )
   }

   @Auth([AppRoles.USER])
   @Get('bookings')
   getBookings(
      @Req() req,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
   ): Promise<AppResponse<BookingEntity[]>> {
      let sortingFields: BookingsSortingFields = {}

      if (sortBy) {
         sortingFields = JSON.parse(sortBy)
      }

      return this.profileService.getUserBookings(
         req.user.id,
         page,
         limit,
         sortingFields,
      )
   }
}
