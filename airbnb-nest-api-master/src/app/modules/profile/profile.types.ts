import { BaseSortingFields, SortDirection } from '../../../utils/shared.types'

export interface AnnouncementSortingFields extends BaseSortingFields {
   isViewed?: SortDirection
   isBlocked?: SortDirection
}

export type BookingsSortingFields = BaseSortingFields
