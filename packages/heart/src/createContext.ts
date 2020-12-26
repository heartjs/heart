import {
  TContextFactory,
  IUninitiatedAggregate,
  TCommandCreator,
  TCommandHandler,
  TSaga,
  TEventHandler,
  TCommand,
  TEvent,
} from './types'

function createCommand<T>(topic: string): TCommandCreator<T> {
  return (payload: T) => ({
    topic,
    payload,
  })
}

type TInput<B> = {
  aggregates: { [aggregateName: string]: IUninitiatedAggregate<any> }
  commandHandlers: { [commandTopic: string]: TCommandHandler<any, B> }
  sagas?: { [commandTopic: string]: TSaga }
  eventHandlers?: { [eventTopic: string]: TEventHandler<any, B> }
}

export function createContext<Bag>({
  aggregates,
  commandHandlers,
  // sagas,
  eventHandlers,
}: TInput<Bag>): TContextFactory<Bag> {
  function context(bag: Bag) {
    // prepare commands
    const commands = Object.keys(commandHandlers)
      .reduce(
        (acc, commandHandlerName) => {
          const commandHandler = commandHandlers[commandHandlerName]
          type TCommand = Parameters<typeof commandHandler>[0]

          return {
            ...acc,
            [commandHandlerName]: createCommand<TCommand>(commandHandlerName),
          }
        },
        {},
      )

    const preparedCommandHandlers = Object.keys(commandHandlers)
      .reduce(
        (acc, commandHandlerName) => ({
          ...acc,
          [commandHandlerName]: (command: TCommand<unknown>) => (
            commandHandlers[command.topic](command, bag)
          ),
        }),
        {},
      )

    const preparedEventHandlers = Object.keys(eventHandlers || {})
      .reduce(
        (acc, eventHandlerName) => {
          const types = eventHandlerName.split(':::')
          const hasCombinedTypes = types.length > 0

          if (hasCombinedTypes) {
            const eventHandlersForTypes = types.reduce(
              (eventHandlersForTypesAcc, type) => ({
                ...eventHandlersForTypesAcc,
                [type]: (event: TEvent<unknown>) => (
                  eventHandlers![event.type](event, bag)
                ),
              }),
              {},
            )

            return {
              ...acc,
              ...eventHandlersForTypes,
            }
          }

          return {
            ...acc,
            [eventHandlerName]: (event: TEvent<unknown>) => (
              eventHandlers![event.type](event, bag)
            ),
          }
        },
        {},
      )

    return {
      aggregates,
      commands,
      commandHandlers: preparedCommandHandlers,
      eventHandlers: preparedEventHandlers,
    }
  }

  return context
}
