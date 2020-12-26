import { TCommand, TEvent } from '../../packages/heart/src/types'
import { createEvent, ExtractType } from '../../packages/heart/src/createEvent'
import { createAggregate } from '../../packages/heart/src/createAggregate'
import { createContext } from '../../packages/heart/src/createContext'
import { createHeart } from '../../packages/heart/src/createHeart'

async function measure(title: string, callback: any) {
  const startTime = new Date().getTime()
  await callback()
  const endTime = new Date().getTime()
  console.log(`Elapsed: "${title}" >>> ${endTime - startTime}ms`)
}

// EVENTS

const orderCreated = createEvent<{ test: string }>('orderCreated')
const orderUpdated = createEvent<{ test: string }>('orderUpdated')

// AGGREGATES

const order = createAggregate({
  name: 'test-aggregate',

  initialState: {
    id: 'test-id',
    test: 'initialState',
  },

  onCreate: (payload) => ([
    orderCreated({ test: payload }),
  ]),

  actions: {
    update: (_, input: { test: string }) => {
      console.log(input)
      return [
        orderUpdated({ test: input.test }),
      ]
    },
  },

  reducers: {
    [orderCreated.type]: (state, event: ExtractType<typeof orderCreated>) => {
      console.log(state, event)
      return {
        ...state,
        test: event.payload.test,
      }
    },
  },
})

// CONTEXTS
const orderProcessing = createContext<typeof bag>({
  aggregates: { order },

  commandHandlers: {
    createOrder: async (command: TCommand<{ id: string }>) => {
      const aggregate = order.create('create')
      console.log('!!! THIS IS CREATE ORDER COMMAND HANDLER:', { id: command.payload.id })
      return [aggregate]
    },

    updateOrder: async (command: TCommand<{ id: string, test: string }>, context) => {
      if (command.payload.test == null || command.payload.test === '') {
        throw new Error('Test is required prop')
      }

      const aggregate = await context.repositories.order.getById(command.payload.id)
      console.log('!!! THIS IS UPDATE ORDER COMMAND HANDLER:', { id: command.payload.id })
      aggregate.update({ id: 'hi', test: command.payload.test })
      return [aggregate]
    },
  },

  eventHandlers: {
    [orderCreated.type]: async (event: TEvent<any>, context) => {
      console.log('!!! ORDER CREATED EVENT HANDLER: ', event)
      console.log({ bag: context })
    },

    [orderUpdated.type]: async (event: TEvent<any>, context) => {
      console.log('!!! ORDER UPDATED EVENT HANDLER: ', event)
      console.log({ bag: context })
    },
  },
})

// DOMAIN
const eventStore = {
  getEventsFor: async (id: string) => {
    console.log('EVENT STORE: GET EVENTS FOR', { id })
    return []
  },

  saveEvents: async (events: any[]) => {
    console.log('EVENT STORE: SAVE EVENTS', events)
  },
}

const bag = {
  repositories: {
    order: {
      getById: async (id: string) => {
        const events = await eventStore.getEventsFor(id)
        return order.loadFromHistory(events)
      },
    },
  },

  eventStore,
}

const domain = createHeart({
  contexts: { orderProcessing },
  bag,
  eventStore: {
    saveEvents: async (events) => console.log(events),
  },
})

// anotherFile.ts
async function run() {
  const {
    createOrder,
    updateOrder,
  } = domain.commands

  measure(
    'main function call',
    async () => {
      try {
        await domain.dispatch(createOrder({ id: 'id' }))
        await domain.dispatch(updateOrder({ id: 'id', test: 'some-required-update' }))
      } catch (err) {
        console.error('ERROR >>> ', err)
      }
    },
  )
}
run()
