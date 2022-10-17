import { FeedbackEntity } from './feedback.entity'
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { ListingEntity } from './listing.entity'
import { BookingEntity } from './booking.entity'
import { ImageEntity } from './image.entity'
import { LikesEntity } from './likes.entity'
import { DislikesEntity } from './dislikes.entity'

@Entity('users')
export class UserEntity extends AppBaseEntity {
   @Column('varchar', { nullable: false, unique: true })
   email: string

   @Column('varchar', { nullable: false })
   name: string

   @Column('varchar', { nullable: true })
   avatar: string

   @OneToMany(() => ListingEntity, (listing) => listing.user, {
      onDelete: 'CASCADE',
   })
   listings: ListingEntity[]

   @OneToMany(() => BookingEntity, (booking) => booking.user, {
      onDelete: 'CASCADE',
   })
   bookings: BookingEntity[]

   @OneToMany(() => FeedbackEntity, (feedback) => feedback.user, {
      onDelete: 'CASCADE',
   })
   feedbacks: FeedbackEntity[]

   @OneToMany(() => LikesEntity, (likes) => likes.user, {
      onDelete: 'CASCADE',
   })
   likes: LikesEntity[]

   @OneToMany(() => DislikesEntity, (dislike) => dislike.user, {
      onDelete: 'CASCADE',
   })
   dislikes: DislikesEntity[]
}
