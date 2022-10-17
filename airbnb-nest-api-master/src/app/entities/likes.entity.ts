import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'

import { UserEntity } from './user.entity'
import { FeedbackEntity } from './feedback.entity'

@Entity('likes')
export class LikesEntity extends AppBaseEntity {
   @ManyToOne(() => UserEntity, (user) => user.likes, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   user: UserEntity

   @ManyToOne(() => FeedbackEntity, (feedback) => feedback.likeEntities, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   feedback: FeedbackEntity
}
