import { FeedbackImageEntity } from './feedbackImage.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'

import { ListingEntity } from './listing.entity'
import { UserEntity } from './user.entity'
import { LikesEntity } from './likes.entity'
import { DislikesEntity } from './dislikes.entity'

@Entity('feedbacks')
export class FeedbackEntity extends AppBaseEntity {
   @Column('integer', { nullable: false, default: 0 })
   rating: number

   @Column('text', { nullable: false })
   comment: string

   @Column('integer', { nullable: false, default: 0 })
   likes: number

   @Column('integer', { nullable: false, default: 0 })
   dislikes: number

   @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   user: UserEntity

   @ManyToOne(() => ListingEntity, (listing) => listing.feedbacks, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   listing: ListingEntity

   @OneToMany(() => FeedbackImageEntity, (image) => image.feedback, {
      eager: true,
      onDelete: 'CASCADE',
   })
   images: FeedbackImageEntity[]

   @OneToMany(() => LikesEntity, (likes) => likes.feedback, {
      onDelete: 'CASCADE',
   })
   likeEntities: LikesEntity[]

   @OneToMany(() => DislikesEntity, (dislikes) => dislikes.feedback, {
      onDelete: 'CASCADE',
   })
   dislikeEntities: DislikesEntity[]
}
