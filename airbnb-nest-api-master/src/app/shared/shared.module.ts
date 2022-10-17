import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
   AdminRepository,
   BookingRepository,
   DislikesRepository,
   FeedbackImageRepository,
   FeedbackRepository,
   ImageRepository,
   LikesRepository,
   ListingImageRepository,
   ListingRepository,
   RegionRepository,
   UserRepository,
} from '../repositories'
import { FileService } from './services/file.service'
import { JwtModule } from '@nestjs/jwt'
import { JWT_CONFIG } from '../config/app.config'

const REPOSITORIES = [
   BookingRepository,
   ImageRepository,
   UserRepository,
   ListingRepository,
   RegionRepository,
   FeedbackRepository,
   FeedbackImageRepository,
   AdminRepository,
   ListingImageRepository,
   DislikesRepository,
   LikesRepository,
]

@Module({
   imports: [
      TypeOrmModule.forFeature(REPOSITORIES),
      JwtModule.register(JWT_CONFIG),
   ],
   providers: [FileService],
   exports: [TypeOrmModule, FileService, JwtModule],
   controllers: [],
})
export class SharedModule {}
