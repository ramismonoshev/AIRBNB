import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class RegionDto {
   @IsNotEmpty()
   @IsString()
   title: string

   @IsNotEmpty()
   @IsString()
   longitude: string

   @IsNotEmpty()
   @IsString()
   latitude: string

   @IsNotEmpty()
   @IsString()
   image: string
}
