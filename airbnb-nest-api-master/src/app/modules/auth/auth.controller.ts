import {
   Body,
   Controller,
   Post,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AdminLogInDto, LogInWithGoogleDto, RegisterAdminDto } from './auth.dto'
import { AdminLogInResponse, LogInWithGoogleResponse } from './auth.types'
import { AppResponse } from '../../../utils/shared.types'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('user/login')
   @UsePipes(ValidationPipe)
   logInViaGoogle(
      @Body() data: LogInWithGoogleDto,
   ): Promise<AppResponse<LogInWithGoogleResponse>> {
      return this.authService.logInViaGoogle(data.idToken)
   }

   @Post('admin/login')
   @UsePipes(ValidationPipe)
   logInAsAnAdmin(
      @Body() data: AdminLogInDto,
   ): Promise<AppResponse<AdminLogInResponse>> {
      return this.authService.logInAsAnAdmin(data)
   }

   @Post('admin/register')
   @UsePipes(ValidationPipe)
   registerAdmin(
      @Body() data: RegisterAdminDto,
   ): Promise<AppResponse<AdminLogInResponse>> {
      return this.authService.registerAdmin(data)
   }
}
