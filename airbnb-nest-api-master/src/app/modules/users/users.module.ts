import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
   imports: [SharedModule],
   controllers: [UsersController],
   providers: [UsersService, Logger],
})
export class UsersModule {}
