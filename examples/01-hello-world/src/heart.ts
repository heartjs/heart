import { createHeart } from '@heartjs/heart'
import { common } from './common'

const { commands, dispatch } = createHeart({
  contexts: { common },

  // механизм сохранения/загрузки ивентов. Т.е. любой адаптер к базе данных
  eventStore: {
    saveEvents: async (events: any[]) => {
      console.log('eventStore.saveEvents', events)
    },
  },

  bag: {},
})

export { commands, dispatch }
