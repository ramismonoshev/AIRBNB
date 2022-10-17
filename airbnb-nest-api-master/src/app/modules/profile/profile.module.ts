import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'

@Module({
   imports: [SharedModule],
   controllers: [ProfileController],
   providers: [ProfileService, Logger],
})
export class ProfileModule {}
