import Command from './Command'
import CommandHandler from './CommandHandler'
import Event from './Event'
import EventHandler from './eventHandler'

import { InfrastractureError } from './errors/InfrastractureError'

import { IEventsStore } from './interfaces/eventStore'
import { ILoggingService } from './interfaces/loggingService'

import invariant from './errors/invariant'

export type TDependencies = {
  eventsStore: IEventsStore
  loggingService: ILoggingService
}

/**
 * @todo add tests
 * @todo make dependencies as generic
 */
export default class Bus {
  private eventsStore: IEventsStore

  protected logger: ILoggingService

  protected constructor(dependencies: TDependencies) {
    this.eventsStore = dependencies.eventsStore
    this.logger = dependencies.loggingService
  }

  public static create = (dependencies: TDependencies): Bus => new Bus(dependencies)

  public handleCommand = async (command: Command<any>): Promise<Bus> => {
    const handlers = this.listOfCommandHandlers
      .filter((commandHandler) => commandHandler.topic === command.topic)
    const handler = handlers[0]

    invariant(
      `CommandHandler for topic "${command.topic}" was not found`,
      () => handler != null,
    )
    invariant(
      `Found ${handlers.length} commandHandlers for topic "${command.topic}". Should be only 1`,
      () => handlers.length === 1,
    )

    const events = await handler!.handle(command)
    await this.processEvents(events)
    return this
  }

  private processEvents = async (events: Event<any>[]): Promise<Bus> => {
    this.logger.debug(JSON.stringify(events.map((event) => event.toJSON()), null, 2), 'Bus.ts')

    try {
      await this.eventsStore.saveEventsToStore(events)
    } catch (err) {
      this.logger.error(err, 'Bus.ts/processEvents/saveEventsToStore')
      throw new InfrastractureError('Could not save events to EventStore. Please try again')
    }

    const promises = events.map(async (event) => {
      try {
        const handlers = this.listOfEventSubscribers
          .filter((eventSubscriber) => eventSubscriber.topic.includes(event.type))

        await Promise.all(
          handlers.map((handler) => handler.handle(event)),
        )
      } catch (err) {
        this.logger.error(err, 'Bus.ts/processEvents/handleEventSubscribers')
      }
    })

    await Promise.all(promises)

    return this
  }

  readonly listOfCommandHandlers: CommandHandler[] = []

  readonly listOfEventSubscribers: EventHandler[] = []

  public registerCommandHandler = (handler: CommandHandler): Bus => {
    invariant(
      `Each command topic can be handled only by one handler. "${handler.topic}" duplicated`,
      () => {
        const listOfTopics = this.listOfCommandHandlers
          .map((commandHandler) => commandHandler.topic)
        return !listOfTopics.includes(handler.topic)
      },
    )

    this.listOfCommandHandlers.push(handler)
    return this
  }

  public registerEventSubscriber = (subscriber: EventHandler): Bus => {
    this.listOfEventSubscribers.push(subscriber)
    return this
  }
}
