import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Put,
   Query,
   Req,
   UploadedFile,
   UseInterceptors,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common'
import { ListingService } from './listing.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppResponse, AppRoles, MulterFile } from '../../../utils/shared.types'
import {
   ListingFilterFields,
   ListingSortingFields,
   UploadedImageResponse,
} from './listing.types'
import {
   BookTheListingDto,
   CreateListingDto,
   LeaveFeedbackDto,
   RejectApplicationDto,
} from './listing.dto'
import { BookingEntity, FeedbackEntity, ListingEntity } from '../../entities'
import { Auth } from '../../shared/decorators/auth.decorator'

@Controller('listings')
export class ListingController {
   constructor(private readonly listingService: ListingService) {}

   @Auth([AppRoles.USER])
   @Post('')
   @UsePipes(ValidationPipe)
   create(
      @Req() req,
      @Body() data: CreateListingDto,
   ): Promise<AppResponse<ListingEntity>> {
      return this.listingService.create(data, req.user.id)
   }

   @Auth([AppRoles.USER, AppRoles.ADMIN])
   @Put(':id')
   @UsePipes(ValidationPipe)
   update(
      @Param('id') id: string,
      @Body() data: CreateListingDto,
   ): Promise<AppResponse<ListingEntity>> {
      return this.listingService.update(data, id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch('/:id/accept')
   @UsePipes(ValidationPipe)
   acceptApplication(
      @Param('id') id: string,
   ): Promise<AppResponse<ListingEntity>> {
      return this.listingService.acceptListingApplication(id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch('/:id/reject')
   @UsePipes(ValidationPipe)
   rejectApplication(
      @Param('id') id: string,
      @Body() data: RejectApplicationDto,
   ): Promise<AppResponse<ListingEntity>> {
      return this.listingService.rejectListingApplication(id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch('/:id/block')
   @UsePipes(ValidationPipe)
   blockListing(@Param('id') id: string): Promise<AppResponse<ListingEntity>> {
      return this.listingService.blockListing(id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch('/:id/unblock')
   @UsePipes(ValidationPipe)
   unBlockListing(
      @Param('id') id: string,
   ): Promise<AppResponse<ListingEntity>> {
      return this.listingService.unBlockListing(id)
   }

   @Auth([AppRoles.ADMIN])
   @Patch('/:id/markAsViewed')
   @UsePipes(ValidationPipe)
   markAsViewed(@Param('id') id: string): Promise<AppResponse<ListingEntity>> {
      return this.listingService.markAsViewed(id)
   }

   @Get(':id')
   getById(@Param('id') id: string): Promise<AppResponse<ListingEntity>> {
      return this.listingService.getById(id)
   }

   @Delete(':id')
   delete(@Param('id') id: string): Promise<AppResponse<ListingEntity>> {
      return this.listingService.delete(id)
   }

   @Get()
   getAll(
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('sortBy') sortBy?: string,
      @Query('filterBy') filterBy?: string,
   ): Promise<AppResponse<ListingEntity[]>> {
      let sortingFields: ListingSortingFields = {}
      let filters: ListingFilterFields = {}

      if (sortBy) {
         sortingFields = JSON.parse(sortBy)
      }

      if (filterBy) {
         filters = JSON.parse(filterBy)
      }

      return this.listingService.getAll(page, limit, sortingFields, filters)
   }

   @Auth([AppRoles.USER])
   @Post('upload/image')
   @UseInterceptors(FileInterceptor('image'))
   uploadImage(
      @UploadedFile() file: MulterFile,
   ): Promise<UploadedImageResponse> {
      return this.listingService.uploadImage(file)
   }

   @Auth([AppRoles.USER])
   @Post('/:id/leaveFeedback')
   @UsePipes(ValidationPipe)
   leaveFeedbackToListing(
      @Req() req,
      @Param('id') listingId: string,
      @Body() data: LeaveFeedbackDto,
   ): Promise<AppResponse<FeedbackEntity>> {
      return this.listingService.leaveFeedback(data, req.user.id, listingId)
   }

   @Auth([AppRoles.USER])
   @Post('upload/feedback/image')
   @UseInterceptors(FileInterceptor('image'))
   uploadFeedbackImage(
      @UploadedFile() file: MulterFile,
   ): Promise<UploadedImageResponse> {
      return this.listingService.uploadFeedbackImage(file)
   }

   @Auth([AppRoles.USER])
   @Post('/:id/book')
   @UsePipes(ValidationPipe)
   bookTheListing(
      @Req() req,
      @Param('id') listingId: string,
      @Body() data: BookTheListingDto,
   ): Promise<AppResponse<BookingEntity>> {
      return this.listingService.bookTheListing(data, req.user.id, listingId)
   }
}
