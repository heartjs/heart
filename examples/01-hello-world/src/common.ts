import { createContext } from '@heartjs/heart'
import { cart } from './cart'

export const common = createContext({
  aggregates: { cart },

  commandHandlers: {
    addProductToCart: async (command: any) => {
      const aggregate = cart.create({ id: command.payload.id })
      aggregate.addProduct({ product: command.payload.product })
      return [aggregate]
    },

    removeProductFromCart: async (command: any) => {
      const aggregate = cart.create({ id: command.payload.id })
      aggregate.removeProduct({ product: command.payload.product })
      return [aggregate]
    },
  },
})
