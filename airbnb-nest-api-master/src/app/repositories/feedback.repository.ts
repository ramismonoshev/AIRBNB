import { EntityRepository, Repository } from 'typeorm'
import { FeedbackEntity } from '../entities'

@EntityRepository(FeedbackEntity)
export class FeedbackRepository extends Repository<FeedbackEntity> {}
