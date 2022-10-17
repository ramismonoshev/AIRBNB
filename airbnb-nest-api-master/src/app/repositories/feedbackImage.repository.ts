import { EntityRepository, Repository } from 'typeorm'
import { FeedbackImageEntity } from '../entities'

@EntityRepository(FeedbackImageEntity)
export class FeedbackImageRepository extends Repository<FeedbackImageEntity> {}
