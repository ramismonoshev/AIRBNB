import { EntityRepository, Repository } from 'typeorm'
import { LikesEntity } from '../entities'

@EntityRepository(LikesEntity)
export class LikesRepository extends Repository<LikesEntity> {}
