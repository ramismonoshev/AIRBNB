import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppResponse } from '../../../utils/shared.types'

import { AdminLogInResponse, LogInWithGoogleResponse } from './auth.types'
import { FIREBASE_CONFIG } from '../../config/app.config'
import { AdminRepository, UserRepository } from '../../repositories'
import { initializeApp } from 'firebase/app'
import {
   getAuth,
   signInWithCredential,
   GoogleAuthProvider,
} from 'firebase/auth'
import { AdminLogInDto, RegisterAdminDto } from './auth.dto'
import * as bcrypt from 'bcrypt'
import { AdminEntity } from '../../entities'

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG)

@Injectable()
export class AuthService {
   constructor(
      private readonly userRepo: UserRepository,
      private readonly adminRepo: AdminRepository,
      private readonly jwtService: JwtService,
      private readonly logger: Logger,
   ) {}

   async logInViaGoogle(
      idToken: string,
   ): Promise<AppResponse<LogInWithGoogleResponse>> {
      try {
         const credential = GoogleAuthProvider.credential(idToken)

         const auth = getAuth()
         const {
            user: { displayName, email, photoURL },
         } = await signInWithCredential(auth, credential)

         const user = await this.userRepo.findOne({ email })

         if (!user) {
            const newUser = this.userRepo.create()
            newUser.email = email
            newUser.name = displayName
            newUser.avatar = photoURL
            await newUser.save()

            return { data: { user: newUser, idToken: credential.idToken } }
         }

         return { data: { user, idToken: credential.idToken } }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async logInAsAnAdmin({
      email,
      password,
   }: AdminLogInDto): Promise<AppResponse<AdminLogInResponse>> {
      try {
         const errorMessage = 'Incorrect email or password.'
         const user = await this.adminRepo
            .createQueryBuilder('user')
            .select(['user.password', 'user.email', 'user.id', 'user.name'])
            .where('user.email = :email', { email })
            .getOne()

         if (!user) {
            throw new HttpException(
               { message: errorMessage },
               HttpStatus.UNAUTHORIZED,
            )
         }

         const isValidPassword = await user.validatePassword(password)
         if (!isValidPassword) {
            throw new HttpException(
               { message: errorMessage },
               HttpStatus.UNAUTHORIZED,
            )
         }

         const jwtToken = await this.generateJwtToken(user)

         user.password = null

         return {
            data: { user, token: jwtToken },
         }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   async registerAdmin(
      data: RegisterAdminDto,
   ): Promise<AppResponse<AdminLogInResponse>> {
      try {
         const { email, name, password } = data

         const user = await this.adminRepo.findOne({ email })

         if (user) {
            throw new HttpException(
               'Пользователь с таким email уже существует.',
               HttpStatus.FORBIDDEN,
            )
         }

         const newUser = this.adminRepo.create()
         newUser.email = email
         newUser.name = name
         newUser.password = await this.hashedPassword(password)
         await newUser.save()

         const jwtToken = await this.generateJwtToken(newUser)
         newUser.password = null

         return {
            data: {
               user: newUser,
               token: jwtToken,
            },
         }
      } catch (error) {
         this.logger.log(error)
         throw error
      }
   }

   hashedPassword(password: string): Promise<string> {
      return bcrypt.hash(password, 12)
   }

   generateJwtToken(user: AdminEntity): Promise<string> {
      return this.jwtService.signAsync({
         id: user.id,
         sub: user.id,
      })
   }
}
