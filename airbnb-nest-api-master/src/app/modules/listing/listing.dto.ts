import {
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator'
import { ListingType } from '../../entities'

export class CreateListingDto {
   @IsNotEmpty()
   @IsString()
   title: string

   @IsNotEmpty()
   @IsString()
   description: string

   @IsNotEmpty()
   @IsArray()
   images: string[]

   @IsNotEmpty()
   @IsEnum(ListingType)
   type: ListingType

   @IsNotEmpty()
   @IsString()
   address: string

   @IsNotEmpty()
   @IsString()
   regionId: string

   @IsNotEmpty()
   @IsNumber()
   price: number

   @IsNotEmpty()
   @IsNumber()
   maxNumberOfGuests: number

   @IsOptional()
   @IsString()
   town: string
}

export class LeaveFeedbackDto {
   @IsNotEmpty()
   @IsNumber()
   rating: number

   @IsNotEmpty()
   @IsString()
   comment: string

   @IsNotEmpty()
   @IsArray()
   images: string[]
}

export class RejectApplicationDto {
   @IsNotEmpty()
   @IsString()
   reason: string
}

export class BookTheListingDto {
   @IsNotEmpty()
   @IsString()
   checkInDate: Date

   @IsNotEmpty()
   @IsString()
   checkoutDate: Date

   @IsNotEmpty()
   @IsNumber()
   amount: number
}
