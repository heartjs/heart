import { createEvent } from '../createEvent'

export function combineTypes(...events: ReturnType<typeof createEvent>[]): string {
  return events
    .map((event) => event.type)
    .join(':::')
}
