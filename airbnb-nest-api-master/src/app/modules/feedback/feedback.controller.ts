import {
   Controller,
   Param,
   Patch,
   Req,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common'
import { FeedbackService } from './feedback.service'
import { AppResponse, AppRoles } from '../../../utils/shared.types'

import { FeedbackEntity } from '../../entities'
import { Auth } from '../../shared/decorators/auth.decorator'

@Controller('feedbacks')
export class FeedbackController {
   constructor(private readonly feedbackService: FeedbackService) {}

   @Auth([AppRoles.USER])
   @Patch('/:id/like')
   @UsePipes(ValidationPipe)
   like(
      @Req() req,
      @Param('id') id: string,
   ): Promise<AppResponse<FeedbackEntity>> {
      return this.feedbackService.like(req.user.id, id)
   }

   @Auth([AppRoles.USER])
   @Patch('/:id/dislike')
   @UsePipes(ValidationPipe)
   dislike(
      @Req() req,
      @Param('id') id: string,
   ): Promise<AppResponse<FeedbackEntity>> {
      return this.feedbackService.dislike(req.user.id, id)
   }
}
