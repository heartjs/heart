import * as R from 'ramda'
import { InfrastractureError } from './errors'
import {
  IUninitiatedAggregate,
  TAggregate,
  TUninitializedAction,
  TReducer,
  TEventWithoutAggregateId,
  TEvent,
} from './types'

type TInput<State extends { id: string }> = {
  name: string
  initialState: State
  actions: { [methodName: string]: TUninitializedAction<State> }
  reducers: { [reducerName: string]: TReducer<State> }

  onCreate?: (payload: any) => TEventWithoutAggregateId<unknown>[]
}

type TAggregateFactoryInput<State extends { id: string }> = {
  name: string
  initialState: State
  changes: TEventWithoutAggregateId<any>[]
  actions: { [methodName: string]: TUninitializedAction<State> }
  reducers: { [reducerName: string]: TReducer<State> }
}
function aggregateFactory<State extends { id: string }>(
  input: TAggregateFactoryInput<State>,
): TAggregate<State> {
  let state = R.clone(input.initialState)
  const changes: TEventWithoutAggregateId<any>[] = R.clone(input.changes)

  const reducers: { [key: string]: TReducer<State> } = Object.keys(input.reducers).reduce(
    (acc, key) => {
      const reducer = input.reducers[key]
      return {
        ...acc,
        [key]: reducer,
      }
    },
    {},
  )

  const handleEvent = (event: TEvent<unknown>): void => {
    try {
      state = reducers[event.type](state, event)
    } catch (err) {
      throw new InfrastractureError(`Aggregate with name "${input.name}" have no reducer for event type "${event.type}"`)
    }
  }

  const prepareEvent = (
    eventWithoutAggregateId: TEventWithoutAggregateId<unknown>,
  ): TEvent<unknown> => eventWithoutAggregateId({
    aggregateId: state.id,
    aggregateName: input.name,
  })

  const applyChange = (eventWithoutAggregateId: TEventWithoutAggregateId<unknown>): void => {
    const preparedEvent = prepareEvent(eventWithoutAggregateId)
    changes.push(eventWithoutAggregateId)
    handleEvent(preparedEvent)
  }

  // prepare actions
  const actions = Object.keys(input.actions).reduce<{ [actionName: string]: TUninitializedAction<State> }>(
    (acc, methodName) => {
      const method = input.actions[methodName]
      const result = (methodInput: any) => {
        const eventsWithoutAggregateId = method(state, methodInput)
        eventsWithoutAggregateId.forEach(applyChange)
        return eventsWithoutAggregateId
      }
      return {
        ...acc,
        [methodName]: result,
      }
    },
    {},
  )

  return {
    ...actions,
    id: state.id,
    name: input.name,
    // prepare changes
    getChanges: () => changes.map(prepareEvent),
    // prepare state
    getState: () => state,
  } as any
}

export function createAggregate<State extends { id: string }>(
  input: TInput<State>,
): IUninitiatedAggregate<State> {
  const reducers: { [key: string]: TReducer<State> } = Object.keys(input.reducers).reduce(
    (acc, key) => {
      const reducer = input.reducers[key]
      return {
        ...acc,
        [key]: reducer,
      }
    },
    {},
  )

  const handleEvent = (state: State, event: TEvent<unknown>): State => {
    try {
      return reducers[event.type](state, event)
    } catch (err) {
      throw new InfrastractureError(`Aggregate with name "${input.name}" have no reducer for event type "${event.type}"`)
    }
  }

  const prepareEvent = (
    eventWithoutAggregateId: TEventWithoutAggregateId<unknown>,
  ): TEvent<unknown> => eventWithoutAggregateId({
    aggregateId: input.initialState.id,
    aggregateName: input.name,
  })

  const applyChange = (
    state: State,
    eventWithoutAggregateId: TEventWithoutAggregateId<unknown>,
  ): State => {
    const preparedEvent = prepareEvent(eventWithoutAggregateId)
    return handleEvent(state, preparedEvent)
  }

  return {
    create: (payload: any): TAggregate<State> => {
      let state = R.clone(input.initialState)
      let changes: TEventWithoutAggregateId<any>[] = []

      if (input.onCreate) {
        const events = input.onCreate(payload)
        state = events.reduce(applyChange, input.initialState)
        changes = events
      }

      return aggregateFactory({
        ...input,
        initialState: state,
        changes,
      })
    },

    loadFromHistory: (events: TEvent<any>[]): TAggregate<State> => {
      const state = events.reduce(handleEvent, input.initialState)
      return aggregateFactory({
        ...input,
        initialState: state,
        changes: [],
      })
    },
  }
}

export type ExtractStateFromAggregate<Payload extends IUninitiatedAggregate<unknown>> = (
  ReturnType<ReturnType<Payload['create']>['getState']>
)
