import { EntityRepository, Repository } from 'typeorm'
import { BookingEntity } from '../entities'

@EntityRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> {}
