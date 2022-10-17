import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { RegionService } from './region.service'
import { RegionController } from './region.controller'

@Module({
   imports: [SharedModule],
   controllers: [RegionController],
   providers: [RegionService, Logger],
})
export class RegionModule {}
