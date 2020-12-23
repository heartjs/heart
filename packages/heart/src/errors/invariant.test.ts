import { DomainError } from './DomainError'
import invariant from './invariant'

describe('invariant', () => {
  test('success', () => {
    expect(() => invariant('Should not throw', () => true))
      .not.toThrow(DomainError)
  })

  test('error', () => {
    expect(() => invariant('Should throw', () => false))
      .toThrow(DomainError)
  })
})
