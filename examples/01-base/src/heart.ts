import { createHeart } from '@heartjs/heart'
import { orderProcessing } from './orderProcessing'
import { order } from './orderProcessing/order'
import { IRepositories } from './orderProcessing/interfaces/repositories'

const eventStore = {
  getEventsFor: async (id: string) => {
    console.log('eventStore.getEventsFor(id)', id)
    return []
  },

  saveEvents: async (events: any[]) => {
    console.log('eventStore.saveEvents', events)
  },
}

type TBag = IRepositories
const bag: TBag = {
  repositories: {
    order: {
      getById: async (id: string) => {
        const events = await eventStore.getEventsFor(id)
        return order.loadFromHistory(events)
      },
    },
  },
}

const { commands, dispatch } = createHeart({
  contexts: { orderProcessing },
  bag,
  eventStore,
})

export { commands, dispatch }
