import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import { ListingEntity } from './listing.entity'
import { ImageEntity } from './image.entity'

@Entity('regions')
export class RegionEntity extends AppBaseEntity {
   @Column('varchar', { nullable: false, unique: true })
   title: string

   @Column('varchar', { nullable: false })
   longitude: string

   @Column('varchar', { nullable: false })
   latitude: string

   @OneToOne(() => ImageEntity, {
      eager: true,
      onDelete: 'CASCADE',
      nullable: false,
   })
   @JoinColumn()
   image: ImageEntity

   @OneToMany(() => ListingEntity, (listing) => listing.region, {
      onDelete: 'SET NULL',
   })
   listings: ListingEntity[]
}
