import { AdminEntity, UserEntity } from '../../entities'

export interface LogInWithGoogleResponse {
   user: UserEntity
   idToken: string
}

export interface AdminLogInResponse {
   user: AdminEntity
   token: string
}
