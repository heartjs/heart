import Event from './Event'
import Command from './command'

import { IEventsStore } from './interfaces/eventStore'

export type THandle = (command: Command<any>) => Promise<Event<any>[]>

type Dependencies = {
  eventsStore: IEventsStore
}

/**
 * @todo move topics to generic
 * @todo move dependencies to generic
 */
export default abstract class CommandHandler {
  public topic: string

  protected eventsRepository: IEventsStore

  constructor(dependencies: Dependencies) {
    this.eventsRepository = dependencies.eventsStore
  }

  /* eslint-disable-next-line */ // @ts-ignore
  public abstract handle: THandle = async (command) => ([])
}
