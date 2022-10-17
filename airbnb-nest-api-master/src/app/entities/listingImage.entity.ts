import { Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { ListingEntity } from './listing.entity'
import { ImageEntity } from './image.entity'

@Entity('listingImages')
export class ListingImageEntity extends AppBaseEntity {
   @OneToOne(() => ImageEntity, {
      eager: true,
      onDelete: 'CASCADE',
      nullable: false,
   })
   @JoinColumn()
   image: ImageEntity

   @ManyToOne(() => ListingEntity, (listing) => listing.images, {
      onDelete: 'SET NULL',
   })
   @JoinColumn()
   listing: ListingEntity
}
