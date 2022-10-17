import { Injectable, Logger, NotFoundException } from '@nestjs/common'

import {
   DislikesRepository,
   FeedbackRepository,
   LikesRepository,
   UserRepository,
} from '../../repositories'
import { AppResponse } from '../../../utils/shared.types'
import { FeedbackEntity } from '../../entities'

@Injectable()
export class FeedbackService {
   constructor(
      private readonly logger: Logger,
      private readonly feedbackRepo: FeedbackRepository,
      private readonly userRepo: UserRepository,
      private readonly likeRepo: LikesRepository,
      private readonly dislikeRepo: DislikesRepository,
   ) {}

   async like(
      userId: string,
      feedbackId: string,
   ): Promise<AppResponse<FeedbackEntity>> {
      try {
         const user = await this.userRepo.findOne(userId)

         const feedback = await this.feedbackRepo.findOne(feedbackId)
         if (!feedback) {
            throw new NotFoundException('Feedback not found.')
         }

         const like = await this.likeRepo.findOne({ user, feedback })
         if (!like) {
            const newLike = this.likeRepo.create({ user, feedback })
            await newLike.save()
            feedback.likes = feedback.likes + 1
         } else {
            feedback.likes = feedback.likes - 1
            await like.remove()
         }

         await feedback.save()

         return { data: feedback }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async dislike(
      userId: string,
      feedbackId: string,
   ): Promise<AppResponse<FeedbackEntity>> {
      try {
         const user = await this.userRepo.findOne(userId)

         const feedback = await this.feedbackRepo.findOne(feedbackId)
         if (!feedback) {
            throw new NotFoundException('Feedback not found.')
         }

         const dislike = await this.dislikeRepo.findOne({
            user: user,
            feedback,
         })
         if (!dislike) {
            const newDislike = this.dislikeRepo.create({ user, feedback })
            await newDislike.save()
            feedback.dislikes = feedback.dislikes + 1
         } else {
            feedback.dislikes = feedback.dislikes - 1
            await dislike.remove()
         }

         await feedback.save()

         return { data: feedback }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }
}
