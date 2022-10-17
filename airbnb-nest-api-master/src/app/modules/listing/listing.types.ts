import {
   AppResponse,
   BaseSortingFields,
   SortDirection,
} from '../../../utils/shared.types'
import { ListingStatus, ListingType } from '../../entities'

export interface ListingSortingFields extends BaseSortingFields {
   price?: SortDirection
   numOfGuests?: SortDirection
   isViewed?: SortDirection
   isBlocked?: SortDirection
   popular?: SortDirection
}

export interface UploadedImageResponse extends AppResponse {
   imageId: string
}

export interface ListingFilterFields {
   title?: string
   status?: ListingStatus
   search?: string
   type?: ListingType
   regionIds?: string[]
}
