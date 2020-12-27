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

type TOptions = {
  verbose?: boolean
}

const defaultOptions: Required<TOptions> = {
  verbose: false,
}

type TInput<Bag> = {
  contexts: { [contextName: string]: TContextFactory<any> }
  eventStore: IEventStore
  bag: Bag
  options?: TOptions
}

export function createHeart<Bag>({
  contexts,
  eventStore,
  bag,
  options = {},
}: TInput<Bag>): IDomain {
  const combinedOptions: Required<TOptions> = {
    ...defaultOptions,
    ...options,
  }

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
      if (combinedOptions.verbose) {
        console.log(`heartjs: receive command: ${JSON.stringify(command)}`)
      }

      const aggregates = await commandHandlers[command.topic](command, {})
      const events = aggregates.reduce(
        (acc: TEvent<any>[], aggregate) => ([...acc, ...aggregate.getChanges()]),
        [],
      )

      await eventStore.saveEvents(events)

      try {
        const promises = events
          .map((event) => {
            const internalPromises: Promise<void>[] = []

            if (combinedOptions.verbose) {
              console.log(`heartjs: processing event with type: "${event.type}"`)
            }

            const eventHandler = eventHandlers[event.type]
            const wildCardEventHandler = eventHandlers['*']

            if (combinedOptions.verbose) {
              console.log(`heartjs: event handler found, ${eventHandler}`)
            }

            if (wildCardEventHandler) {
              if (combinedOptions.verbose) {
                console.log(`heartjs: wildcard event handler found, ${wildCardEventHandler}`)
              }
              internalPromises.push(wildCardEventHandler(event, bag))
            }

            if (!eventHandler) {
              console.warn(`heartjs: You have not registered eventHandler for event with type "${event.type}"`)
              return undefined
            }

            internalPromises.push(eventHandler(event, bag))

            return internalPromises
          })
          .filter((promise) => promise != null)
          .reduce((acc, internalPromises) => ([...acc!, ...internalPromises!]), [])

        await Promise.all(promises!)
      } catch (err) {
        console.error('Something bad happen at eventHandlers', err)
      }
    },
  }
}
