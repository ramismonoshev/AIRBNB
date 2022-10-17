import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { AppRoles } from '../../../utils/shared.types'

export function Auth(roles: AppRoles[] = []) {
   return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard))
}
