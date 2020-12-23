import * as R from 'ramda'
import Event from './Event'

import { IEventsStore } from './interfaces/eventStore'

export type THandle = (event: Event<any>) => Promise<void>

type Dependencies = {
  eventsStore: IEventsStore
}

/**
 * @todo move topics to generic
 * @todo move dependencies to generic
 */
export default abstract class EventHandler {
  public topic: string[]

  protected eventsStore: IEventsStore

  constructor(dependencies: Dependencies) {
    this.eventsStore = dependencies.eventsStore
  }

  /* eslint-disable-next-line */ // @ts-ignore
  abstract public handle: THandle = async (event) => {
    throw new Error('`EventHandler.handle` should be implemented')
  }

  protected sortEvents = (events: Event<any>[]): Event<any>[] => {
    const toTimestamp = (date: string): number => {
      const parsed = new Date(date)
      const timestamp = parsed.getTime()
      return timestamp
    }

    const sortedEvents = R.sort(
      (left, right) => {
        const leftTimestamp = toTimestamp(left.meta.timestamp)
        const rightTimestamp = toTimestamp(right.meta.timestamp)
        return leftTimestamp - rightTimestamp
      },
      events,
    )

    return sortedEvents
  }
}
