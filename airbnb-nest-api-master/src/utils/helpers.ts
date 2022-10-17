import * as moment from 'moment'
import { DATE_FORMAT } from './constants'

export const formatDate = (date: Date, format = DATE_FORMAT): string => {
   return moment(date).format(format)
}

export const removeCommasAndDots = (text: string): string => {
   return text.trim().replace(/,|\.|/g, '')
}

export const replaceWhiteSpacesWith = (text: string, char: string): string => {
   return text.trim().replace(/ /g, char)
}
