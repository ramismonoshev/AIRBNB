import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AdminLogInDto {
   @IsNotEmpty()
   @IsEmail()
   @IsString()
   email: string

   @IsNotEmpty()
   @IsString()
   password: string
}

export class LogInWithGoogleDto {
   @IsNotEmpty()
   @IsString()
   idToken: string
}

export class RegisterAdminDto {
   @IsNotEmpty()
   @IsEmail()
   @IsString()
   email: string

   @IsNotEmpty()
   @IsString()
   name: string

   @IsNotEmpty()
   @IsString()
   password: string
}
