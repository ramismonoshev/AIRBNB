import { EntityRepository, Repository } from 'typeorm'
import { ListingImageEntity } from '../entities'

@EntityRepository(ListingImageEntity)
export class ListingImageRepository extends Repository<ListingImageEntity> {}
