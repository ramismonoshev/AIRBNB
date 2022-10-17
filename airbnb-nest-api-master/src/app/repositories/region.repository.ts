import { EntityRepository, Repository } from 'typeorm'
import { RegionEntity } from '../entities'

@EntityRepository(RegionEntity)
export class RegionRepository extends Repository<RegionEntity> {}
