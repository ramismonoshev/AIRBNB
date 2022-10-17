import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { ListingEntity } from './listing.entity'
import { UserEntity } from './user.entity'

@Entity('bookings')
export class BookingEntity extends AppBaseEntity {
   @Column('date', { nullable: false })
   checkInDate: Date

   @Column('date', { nullable: false })
   checkOutDate: Date

   @Column('integer', { nullable: false, default: 0 })
   amount: number

   @ManyToOne(() => ListingEntity, (listing) => listing.bookings, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   listing: ListingEntity

   @ManyToOne(() => UserEntity, (user) => user.bookings, {
      onDelete: 'SET NULL',
      eager: true,
   })
   @JoinColumn()
   user: UserEntity
}
