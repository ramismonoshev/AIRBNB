import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'

import { config } from './config/app.config'
import { AuthModule } from './modules/auth/auth.module'
import { ListingModule } from './modules/listing/listing.module'
import { RegionModule } from './modules/region/region.module'
import { ProfileModule } from './modules/profile/profile.module'
import { FeedbackModule } from './modules/feedback/feedback.module'
import { UsersModule } from './modules/users/users.module'

@Module({
   imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      ConfigModule.forRoot(),
      ServeStaticModule.forRoot({
         rootPath: config.STATIC_DIR,
      }),
      AuthModule,
      ListingModule,
      RegionModule,
      ProfileModule,
      FeedbackModule,
      UsersModule,
   ],
})
export class AppModule {}
