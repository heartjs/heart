import { measure } from './utils/measure'
import { commands, dispatch } from './heart'

async function run() {
  const { addProductToCart } = commands

  measure(
    'main function call',
    async () => {
      try {
        await dispatch(addProductToCart({ id: 'some-cart-id', product: 'some-product' }))
        console.log('DONE')
      } catch (err) {
        console.error('ERROR >>> ', err)
      }
    },
  )
}

run()
