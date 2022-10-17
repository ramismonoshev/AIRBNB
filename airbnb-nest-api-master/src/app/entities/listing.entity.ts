import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { UserEntity } from './user.entity'
import { RegionEntity } from './region.entity'
import { BookingEntity } from './booking.entity'
import { FeedbackEntity } from './feedback.entity'
import { ListingImageEntity } from './listingImage.entity'

export enum ListingType {
   APARTMENT = 'APARTMENT',
   HOUSE = 'HOUSE',
}

export enum ListingStatus {
   ACCEPTED = 'ACCEPTED',
   REJECTED = 'REJECTED',
   PENDING = 'PENDING',
}

@Entity('listings')
export class ListingEntity extends AppBaseEntity {
   @Column('varchar', { nullable: false })
   title: string

   @Column('text', { nullable: false })
   description: string

   @Column('varchar', { nullable: false })
   address: string

   @Column('varchar', { nullable: true })
   town: string

   @Column('integer', { nullable: false, default: 0 })
   price: number

   @Column('integer', { nullable: false, default: 0 })
   maxNumberOfGuests: number

   @Column('numeric', { nullable: false, default: 0.0 })
   rating: number

   @Column('boolean', { nullable: false, default: false })
   isBlocked: boolean

   @Column('boolean', { nullable: false, default: false })
   isViewed: boolean

   @Column('enum', { enum: ListingType, default: ListingType.APARTMENT })
   type: ListingType

   @Column('enum', { enum: ListingStatus, default: ListingStatus.PENDING })
   status: ListingStatus

   @ManyToOne(() => RegionEntity, {
      eager: true,
      onDelete: 'SET NULL',
      nullable: false,
   })
   @JoinColumn()
   region: RegionEntity

   @ManyToOne(() => UserEntity, (user) => user.listings, {
      eager: true,
      nullable: false,
      onDelete: 'CASCADE',
   })
   @JoinColumn()
   user: UserEntity

   @OneToMany(() => BookingEntity, (booking) => booking.listing)
   bookings: BookingEntity[]

   @OneToMany(() => FeedbackEntity, (feedback) => feedback.listing)
   feedbacks: FeedbackEntity[]

   @OneToMany(
      () => ListingImageEntity,
      (listingImage) => listingImage.listing,
      { eager: true },
   )
   images: ListingImageEntity[]
}
