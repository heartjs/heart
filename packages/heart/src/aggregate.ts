import * as R from 'ramda'
import Event, { FlattenEvent } from './event'

type ApplyChangeOptions = {
  isNew: boolean
}

type EventApplier<State> = (state: State, event: FlattenEvent<any>) => State

/**
 * @description generic aggregate
 */
export default abstract class Aggregate<Topics extends string, State> {
  /**
   * unique aggregate ID. Used in Events as well
   */
  public id: string

  /**
   * @description current state of aggregate
   */
  protected state: State

  /**
   * @description list of changes after commandHandler work done
   */
  private changes: Event<unknown>[] = []

  /* eslint-disable-next-line */
  protected constructor() {}

  /**
   * @description return list of changes to persist
   */
  public getChanges = (): Event<unknown>[] => R.clone(this.changes)

  /**
   * @description apply history of events to current aggregate
   */
  protected applyHistory = (events: Array<Event<unknown> | FlattenEvent<unknown>>): this => {
    const sortedEvents = this.sortEvents(events)

    sortedEvents.forEach((event) => {
      if (event instanceof Event) {
        this.applyChange(event, { isNew: false })
      } else {
        this.applyEvent(event)
      }
    })

    return this
  }

  /**
   * @description apply one change and update list of changes
   */
  protected applyChange = (
    event: Event<unknown>,
    options: ApplyChangeOptions = { isNew: true },
  ): this => {
    this.applyEvent(event.toJSON())

    if (options.isNew) {
      this.changes.push(event)
    }

    return this
  }

  /**
   * @description map of eventAppliers. Allow make typechecks for each topic.
   * Also has `beforeEach` and `afterEach` hooks which allow prepare date before event
   * or make some cleanups after event
   */
  protected abstract reducers: { [key in Topics]: EventApplier<State> }
  /**
   * @description trigger before all events appliers
   */
  & { beforeEach?: EventApplier<State> }
  /**
   * @description trigger after all events appliers
   */
  & { afterEach?: EventApplier<State> }

  /**
   * @description make actual apply of event which trigger state change
   */
  private applyEvent = (event: FlattenEvent<unknown>): this => {
    const type = event.type as Topics

    if (this.reducers.beforeEach) {
      this.state = this.reducers.beforeEach(this.state, event)
    }

    if (this.reducers[type]) {
      this.state = this.reducers[type](this.state, event)
    } else {
      console.warn(`You forgot to implement eventApplier
on aggregate with ID: "${this.id}" for topic: "${event.type}".
Or possibly your aggregate emit wrong event.`)
    }

    if (this.reducers.afterEach) {
      this.state = this.reducers.afterEach(this.state, event)
    }

    return this
  }

  /**
   * @description little helper to sort events ascending
   */
  /* eslint-disable-next-line */
  private sortEvents<EventType extends Event<unknown> | FlattenEvent<unknown>>(events: EventType[]): EventType[] {
    return R.sort(
      (left, right) => {
        const leftTimestamp = new Date(left.meta.timestamp).getTime()
        const rightTimestamp = new Date(right.meta.timestamp).getTime()
        return leftTimestamp - rightTimestamp
      },
      events,
    )
  }
}
