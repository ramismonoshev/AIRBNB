import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'

import { UserEntity } from './user.entity'
import { FeedbackEntity } from './feedback.entity'

@Entity('dislikes')
export class DislikesEntity extends AppBaseEntity {
   @ManyToOne(() => UserEntity, (user) => user.dislikes, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   user: UserEntity

   @ManyToOne(() => FeedbackEntity, (feedback) => feedback.dislikeEntities, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   feedback: FeedbackEntity
}
