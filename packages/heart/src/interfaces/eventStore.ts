import Event from '../event'

export interface IEventsStore {
  /**
   * @description save event to store
   */
  saveEventsToStore: (events: Event<any>[]) => Promise<void>
}
