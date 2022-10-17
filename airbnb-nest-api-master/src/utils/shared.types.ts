export interface AppResponse<T = any> {
   message?: string
   status?: number
   data?: T
   total?: number
}

export enum SortDirection {
   ASC = 'ASC',
   DESC = 'DESC',
}

export interface BaseSortingFields {
   createdAt?: SortDirection
   updatedAt?: SortDirection
}

export interface NonEmptyObject {
   [key: string]: any
}

export interface IFile {
   originalname: string
   encoding: string
   mimetype: string
   size: number
   buffer: Buffer
}

export interface MulterFile {
   fieldname: string
   originalname: string
   encoding: string
   mimetype: string
   size: number
   destination: string
   filename: string
   path: string
   buffer: Buffer
}

export enum AppRoles {
   USER = 'USER',
   ADMIN = 'ADMIN',
}

export type LoginJwtPayload = {
   id: string
   sub: string
}
