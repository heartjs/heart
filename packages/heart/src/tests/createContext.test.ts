import { createContext } from '../createContext'
import { createEvent } from '../createEvent'
import { combineTypes } from '../utils/combineTypes'

const testEvent01 = createEvent('test-01')
const testEvent02 = createEvent('test-02')
const testEvent03 = createEvent('test-03')

describe('createContext', () => {
  test('support multiple types in eventHandlers', () => {
    const sut = createContext({
      aggregates: {},

      commandHandlers: {},

      eventHandlers: {
        [testEvent01.type]: async (event) => {
          console.log(event)
        },

        [combineTypes(testEvent02, testEvent03)]: async (event) => {
          console.log(event)
        },
      },
    })

    expect(sut({}).eventHandlers![testEvent01.type]).toBeDefined()
    expect(sut({}).eventHandlers![testEvent02.type]).toBeDefined()
    expect(sut({}).eventHandlers![testEvent03.type]).toBeDefined()
  })
})
