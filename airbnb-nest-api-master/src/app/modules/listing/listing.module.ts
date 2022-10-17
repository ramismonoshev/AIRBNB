import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { ListingService } from './listing.service'
import { ListingController } from './listing.controller'

@Module({
   imports: [SharedModule],
   controllers: [ListingController],
   providers: [ListingService, Logger],
})
export class ListingModule {}
