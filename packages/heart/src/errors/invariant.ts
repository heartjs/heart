import { DomainError } from './DomainError'

/**
 * @description check provided condition for truthy. If it's not then throw the error.
 * Similar to integrated `assert` function but with custom error
 * @param message - message to show to the user
 * @param condition - condition to check
 * @throws InvariantError
 */
export default function invariant(message: string, condition: () => boolean): void | never {
  if (!condition()) {
    throw new DomainError(message)
  }
}
