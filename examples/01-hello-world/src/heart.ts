import { createHeart } from '@heartjs/heart'
import { common } from './common'

const { commands, dispatch } = createHeart({
  contexts: { common },

  eventStore: {
    saveEvents: async (events: any[]) => {
      console.log('eventStore.saveEvents', events)
    },
  },

  bag: {},
})

export { commands, dispatch }
