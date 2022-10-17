import { Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { FeedbackEntity } from './feedback.entity'
import { ImageEntity } from './image.entity'

@Entity('feedbackImages')
export class FeedbackImageEntity extends AppBaseEntity {
   @OneToOne(() => ImageEntity, {
      eager: true,
      onDelete: 'CASCADE',
      nullable: false,
   })
   @JoinColumn()
   image: ImageEntity

   @ManyToOne(() => FeedbackEntity, (feedback) => feedback.images, {
      onDelete: 'SET NULL',
   })
   @JoinColumn()
   feedback: FeedbackEntity
}
