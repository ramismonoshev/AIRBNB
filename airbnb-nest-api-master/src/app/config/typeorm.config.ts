import { config } from 'dotenv'
config()
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import {
   BookingEntity,
   RegionEntity,
   ImageEntity,
   ListingEntity,
   UserEntity,
   FeedbackEntity,
   ListingImageEntity,
   AdminEntity,
   FeedbackImageEntity,
   LikesEntity,
   DislikesEntity,
} from '../entities'

export const ENTITIES = [
   UserEntity,
   ImageEntity,
   RegionEntity,
   ListingEntity,
   BookingEntity,
   FeedbackEntity,
   ListingImageEntity,
   AdminEntity,
   FeedbackImageEntity,
   LikesEntity,
   DislikesEntity,
]

export const typeOrmConfig: TypeOrmModuleOptions = {
   type: 'postgres',
   host: 'localhost',
   port: 5432,
   username: 'postgres',
   password: '1234',
   database:  'airbnb',
   entities: ENTITIES,
   synchronize: true,
}
