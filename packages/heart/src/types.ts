// source of truth
export interface IEventStore {
  saveEvents: (events: TEvent<any>[]) => Promise<void | never>
}

export type TCommandCreator<Payload> = (payload: Payload) => TCommand<Payload>
export type TCommand<Payload> = {
  topic: string
  payload: Payload
}

export type TMeta = {
  timestamp: string // iso date
  id: string // event id
  version: number
}
export type TEventWithoutAggregateId<Payload> = (aggregateMeta: { aggregateId: string, aggregateName: string }) => TEvent<Payload>
export type TEvent<Payload> = {
  aggregateId: string
  aggregateName: string
  type: string
  payload: Payload
  meta: TMeta
}

export type TUninitializedAction<State> = (state: State, ...args: any[]) => TEventWithoutAggregateId<any>[]
export type TAction = (...args: any[]) => TEventWithoutAggregateId<any>[]
export type TReducer<State> = (state: State, event: TEvent<any>) => State

export type TCommandHandler<Payload, Bag> = (command: TCommand<Payload>, bag: Bag) => Promise<TAggregate<any>[] | never>

export type TSaga = (command: TCommand<unknown>) => Promise<TEvent<any>[] | never>

export type TEventHandler<Payload, Bag> = (event: TEvent<Payload>, bag: Bag) => Promise<void | never>

export interface IUninitiatedAggregate<S> {
  create: (payload: any) => TAggregate<S>
  loadFromHistory: (events: TEvent<any>[]) => TAggregate<S>
}
/**
 * @description encapsulates all domain logic
 */
export type TAggregate<State> = { [actionName: string]: TAction } & {
  id: string
  name: string
  getState: () => State
  getChanges: () => TEvent<any>[]
}

export type TContextFactory<Bag> = (bag: Bag) => IContext
/**
 * @description bind domain logic with side effects
 */
export interface IContext {
  aggregates: { [aggregateName: string]: IUninitiatedAggregate<unknown> }
  // sagas?: { [commandTopic: string]: TSaga }
  commands: { [commandTopic: string]: TCommandCreator<unknown> }
  commandHandlers: { [commandTopic: string]: TCommandHandler<unknown, any> }
  eventHandlers?: { [eventTopic: string]: TEventHandler<unknown, any> }
}

/**
 * @description provide all routing in app
 */
export interface IDomain {
  commands: { [commandTopic: string]: TCommandCreator<unknown> }
  dispatch: (command: TCommand<unknown>) => Promise<void | never>
}
