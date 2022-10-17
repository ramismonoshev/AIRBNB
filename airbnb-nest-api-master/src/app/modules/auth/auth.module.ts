import { Logger, Module } from '@nestjs/common'
import { SharedModule } from '../../shared/shared.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
   imports: [SharedModule],
   controllers: [AuthController],
   providers: [AuthService, Logger],
})
export class AuthModule {}
