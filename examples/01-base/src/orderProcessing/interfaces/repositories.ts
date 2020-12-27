import { ExtractAggregateType } from '@heartjs/heart/utils'
import { order } from '../order'

export interface IRepositories {
  repositories: {
    order: {
      getById: (id: string) => Promise<ExtractAggregateType<typeof order> | never>
    }
  }
}
