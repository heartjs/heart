import {
  IDomain,
  TContextFactory,
  IContext,
  TCommandCreator,
  TCommandHandler,
  TEventHandler,
  IEventStore,
  TEvent,
} from './types'

type TInput<Bag> = {
  contexts: { [contextName: string]: TContextFactory<any> }
  eventStore: IEventStore
  bag: Bag
}

export function createHeart<Bag>({ contexts, eventStore, bag }: TInput<Bag>): IDomain {
  const createdContexts: { [contextName: string]: IContext } = Object.keys(contexts).reduce(
    (acc, contextName) => {
      const createdContext = contexts[contextName](bag)
      return {
        ...acc,
        [contextName]: createdContext,
      }
    },
    {},
  )

  const commands = Object.keys(createdContexts).reduce<{ [commandTopic: string]: TCommandCreator<unknown> }>(
    (acc, key) => {
      const context = createdContexts[key]
      return { ...acc, ...context.commands }
    },
    {},
  )

  const commandHandlers = Object.keys(createdContexts).reduce<{ [commandTopic: string]: TCommandHandler<unknown, any> }>(
    (acc, key) => {
      const context = createdContexts[key]
      return { ...acc, ...context.commandHandlers }
    },
    {},
  )

  const eventHandlers = Object.keys(createdContexts).reduce<{ [eventTopic: string]: TEventHandler<unknown, any> }>(
    (acc, key) => {
      const internalEventHandlers = createdContexts[key].eventHandlers

      if (internalEventHandlers != null) {
        return { ...acc, ...internalEventHandlers }
      }

      return acc
    },
    {},
  )

  return {
    commands,
    dispatch: async (command) => {
      const aggregates = await commandHandlers[command.topic](command, {})
      const events = aggregates.reduce(
        (acc: TEvent<any>[], aggregate) => ([...acc, ...aggregate.getChanges()]),
        [],
      )

      await eventStore.saveEvents(events)

      try {
        const promises = events
          .map((event) => {
            const eventHandler = eventHandlers[event.type]

            if (!eventHandler) {
              console.warn(`You have not registered eventHandler for event with type "${event.type}"`)
              return undefined
            }

            return eventHandler(event, {})
          })
          .filter((promise) => promise != null)
        await Promise.all(promises)
      } catch (err) {
        console.error('Something bad happen at eventHandlers', err)
      }
    },
  }
}
