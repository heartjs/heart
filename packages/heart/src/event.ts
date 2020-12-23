import * as R from 'ramda'
import generateID from './utils/generateID'

type Meta = {
  /**
   * @description event ID
   */
  id: string

  /**
   * @description timestamp when created in ISO format
   */
  timestamp: string
}

export type FlattenEvent<Payload> = {
  meta: {
    id: string,
    timestamp: string,
    version: number,
  },
  payload: Payload,
  aggregateID: string,
  type: string,
}

export default abstract class Event<Payload> {
  readonly type: string

  readonly payload: Payload

  readonly meta: Meta

  abstract readonly version: number = 1

  /**
   * @todo change with precise aggregateIds enum
   */
  readonly aggregateID: string

  public constructor(payload: Payload, meta?: Meta) {
    this.payload = R.clone(payload)
    this.meta = meta || {
      id: generateID(),
      timestamp: new Date().toISOString(),
    }
  }

  // public static fromJSON<FlattenPayload>(
  //   input: FlattenEvent<FlattenPayload>,
  // ): Event<FlattenPayload> {
  //   const event = new Event(input.payload)
  //   // @ts-ignore
  //   event.aggregateID = input.aggregateID
  //   // @ts-ignore
  //   event.meta = input.meta
  //   // @ts-ignore
  //   event.type = input.type
  //   // @ts-ignore
  //   event.version = input.meta.version
  //   return event
  // }

  public toJSON = (): FlattenEvent<Payload> => ({
    aggregateID: this.aggregateID,
    type: this.type,
    payload: this.payload,
    meta: {
      ...this.meta,
      version: this.version,
    },
  })
}
