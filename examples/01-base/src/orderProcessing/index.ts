import { createContext, TCommand } from '@heartjs/heart'
import { ExtractEventType } from '@heartjs/heart/utils'
import { order } from './order'
import { orderCreated, orderUpdated } from '../events/orderEvents'
import { IRepositories } from './interfaces/repositories'

export const orderProcessing = createContext<IRepositories>({
  aggregates: { order },

  commandHandlers: {
    createOrder: async (command: TCommand<{ id: string }>) => {
      // example of create command
      const aggregate = order.create({ id: command.payload.id })
      return [aggregate]
    },

    updateOrder: async (command: TCommand<{ id: string, test: string }>, bag) => {
      // example of command validation
      if (command.payload.test == null || command.payload.test === '') {
        throw new Error('Test is required prop')
      }

      // example of update command
      const aggregate = await bag.repositories.order.getById(command.payload.id)
      aggregate.update({ test: command.payload.test })
      return [aggregate]
    },
  },

  eventHandlers: {
    [orderCreated.type]: async (event: ExtractEventType<typeof orderCreated>) => {
      console.log('!!! ORDER CREATED EVENT HANDLER: ', event)
    },

    [orderUpdated.type]: async (event: ExtractEventType<typeof orderUpdated>) => {
      console.log('!!! ORDER UPDATED EVENT HANDLER: ', event)
    },
  },
})
