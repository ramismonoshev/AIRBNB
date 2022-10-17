import { Entity, Column } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'

@Entity('images')
export class ImageEntity extends AppBaseEntity {
   @Column('varchar', { nullable: false, unique: true })
   smallImageName: string

   @Column('varchar', { nullable: false, unique: true })
   largeImageName: string

   @Column('varchar', { nullable: false, unique: true })
   smallImagePath: string

   @Column('varchar', { nullable: false, unique: true })
   largeImagePath: string
}
