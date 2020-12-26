import { createEvent, TOptions } from './createEvent'

export function createInitialEvent<Payload extends { id: string }>(
  type: string,
  options?: TOptions,
) {
  return createEvent<Payload>(type, options)
}
