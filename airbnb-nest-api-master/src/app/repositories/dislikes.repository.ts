import { EntityRepository, Repository } from 'typeorm'
import { DislikesEntity } from '../entities'

@EntityRepository(DislikesEntity)
export class DislikesRepository extends Repository<DislikesEntity> {}
