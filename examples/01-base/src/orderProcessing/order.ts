import { createAggregate } from '@heartjs/heart'
import { ExtractEventType } from '@heartjs/heart/utils'

import { orderCreated, orderUpdated } from '../events/orderEvents'

export const order = createAggregate({
  name: 'test-aggregate',

  initialState: {
    id: '',
    test: '',
  },

  onCreate: (payload) => ([
    orderCreated({ id: payload.id }),
  ]),

  actions: {
    update: (_, input: { test: string }) => {
      console.log(input) // just to show you received info

      return [
        orderUpdated({ test: input.test }),
      ]
    },
  },

  reducers: {
    [orderCreated.type]: (state, event: ExtractEventType<typeof orderCreated>) => {
      console.log(state, event) // just to show you received info

      return {
        ...state,
        id: event.payload.id,
      }
    },

    [orderUpdated.type]: (state, event: ExtractEventType<typeof orderUpdated>) => {
      console.log(state, event) // just to show you received info

      return {
        ...state,
        test: event.payload.test,
      }
    },
  },
})
