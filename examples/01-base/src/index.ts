import { measure } from './utils/measure'
import { commands, dispatch } from './heart'

async function run() {
  const { createOrder, updateOrder } = commands

  measure(
    'main function call',
    async () => {
      try {
        await dispatch(createOrder({ id: 'id' }))
        await dispatch(updateOrder({ id: 'id', test: 'some-required-update' }))
      } catch (err) {
        console.error('ERROR >>> ', err)
      }
    },
  )
}

run()
