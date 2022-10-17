import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { FeedbackService } from './feedback.service'
import { FeedbackController } from './feedback.controller'

@Module({
   imports: [SharedModule],
   controllers: [FeedbackController],
   providers: [FeedbackService, Logger],
})
export class FeedbackModule {}
