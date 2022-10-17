import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Inject,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common'
import { AdminEntity, UserEntity } from '../../entities'
import { JwtService } from '@nestjs/jwt'
import {
   getAuth,
   GoogleAuthProvider,
   signInWithCredential,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { FIREBASE_CONFIG } from '../../config/app.config'
import { Reflector } from '@nestjs/core'
import { AppRoles, LoginJwtPayload } from '../../../utils/shared.types'

const app = initializeApp(FIREBASE_CONFIG)

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(
      @Inject(JwtService) private jwtService: JwtService,
      private reflector: Reflector,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      const token =
         request.headers['authorization'] &&
         request.headers['authorization'].split(' ')[1]

      if (!token) {
         throw new UnauthorizedException('Token is not provided!')
      }

      const requestRole = request.headers['role'] as AppRoles

      if (!requestRole) {
         throw new ForbiddenException('Role header is not provided!')
      }

      const guardRoles = this.reflector.get<AppRoles[]>(
         'roles',
         context.getHandler(),
      )

      if (!guardRoles.includes(requestRole)) {
         throw new ForbiddenException('Incorrect role header was provided!')
      }

      if (requestRole === AppRoles.USER) {
         const user: UserEntity = await this.validateClientUserByIdToken(token)
         if (!user) {
            throw new UnauthorizedException('Token is invalid or has expired!')
         }
         request.user = user
         request.role = AppRoles.USER
         return true
      }

      if (requestRole === AppRoles.ADMIN) {
         const user: AdminEntity = await this.validateAdminUserByToken(token)
         if (!user) {
            throw new UnauthorizedException('Token is invalid or has expired!')
         }
         request.user = user
         request.role = AppRoles.ADMIN
         return true
      }

      return false
   }

   async validateClientUserByIdToken(idToken: string): Promise<UserEntity> {
      try {
         const credential = GoogleAuthProvider.credential(idToken)

         const auth = getAuth()
         const {
            user: { email },
         } = await signInWithCredential(auth, credential)

         return UserEntity.findOne({ email })
      } catch (error) {
         throw new UnauthorizedException('Token is invalid or has expired!')
      }
   }

   async validateAdminUserByToken(token: string): Promise<AdminEntity> {
      const payload: LoginJwtPayload = await this.jwtService.verifyAsync(token)
      return await AdminEntity.findOne({ id: payload.id })
   }
}
