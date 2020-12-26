import { generateId } from './utils/generateId'
import {
  TMeta,
  TEventWithoutAggregateId,
} from './types'

export type TOptions = {
  version?: number
}
const defaultOptions: Required<TOptions> = {
  version: 1,
}
export function createEvent<Payload>(topic: string, options: TOptions = {}) {
  const newOptions: Required<TOptions> = {
    ...defaultOptions,
    ...options,
  }

  function event(
    payload: Payload = {} as Payload,
    meta?: TMeta,
  ): TEventWithoutAggregateId<Payload> {
    const eventID = generateId()

    return function addAggregateId({ aggregateId, aggregateName }) {
      return {
        aggregateId,
        aggregateName,
        type: topic,
        payload,
        meta: {
          id: eventID,
          timestamp: new Date().toISOString(),
          version: newOptions.version,
          ...(meta || {}),
        },
      }
    }
  }

  event.toString = () => topic
  event.type = topic

  return event
}

export type ExtractEventType<Payload extends () => (...args: any) => any> = ReturnType<ReturnType<Payload>>
