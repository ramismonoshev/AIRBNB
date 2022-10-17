import { EntityRepository, Repository } from 'typeorm'
import { ListingEntity } from '../entities'

@EntityRepository(ListingEntity)
export class ListingRepository extends Repository<ListingEntity> {}
