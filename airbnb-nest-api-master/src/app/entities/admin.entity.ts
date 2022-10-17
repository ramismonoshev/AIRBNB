import { Column, Entity } from 'typeorm'
import { AppBaseEntity } from './app-base-entity'
import * as bcrypt from 'bcrypt'

@Entity('admins')
export class AdminEntity extends AppBaseEntity {
   @Column('varchar')
   email: string

   @Column('varchar')
   name: string

   @Column('varchar', { select: false })
   password: string

   validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password)
   }
}
