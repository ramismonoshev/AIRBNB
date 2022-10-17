import { ResizeOptions } from 'sharp'

export const DATE_FORMAT = 'DD.MM.YYYY, HH:mm'

export enum IMAGE_SIZE {
   LARGE,
   MEDIUM,
   SMALL,
}

export const IMAGE_RESIZE_OPTIONS: { [key in IMAGE_SIZE]?: ResizeOptions } = {
   [IMAGE_SIZE.LARGE]: {
      width: 900,
      fit: 'cover',
      withoutEnlargement: false,
   },
   [IMAGE_SIZE.MEDIUM]: {
      width: 720,
      fit: 'contain',
      withoutEnlargement: false,
   },
   [IMAGE_SIZE.SMALL]: {
      width: 360,
      fit: 'cover',
      withoutEnlargement: false,
   },
}
