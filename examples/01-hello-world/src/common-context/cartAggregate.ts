import { createAggregate } from '@heartjs/heart'
import {
  cartCreated,
  cartProductAdded,
  cartProductRemoved,
} from '../events/cart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [] as any[],
  },

  onCreate({ id }) {
    return [cartCreated({ id })]
  },

  actions: {
    addProduct(_, { product }: any) {
      return [cartProductAdded({ product })]
    },

    removeProduct(_, { product }: any) {
      return [cartProductRemoved({ product })]
    },
  },

  reducers: {
    [cartCreated.type]: (state, event) => ({
      ...state,
      id: event.payload.id,
    }),

    [cartProductAdded.type]: (state, event) => ({
      ...state,
      products: state.products.concat([event.payload.product]),
    }),

    [cartProductRemoved.type]: (state, event) => ({
      ...state,
      products: state.products.filter((product: any) => product !== event.payload.product),
    }),
  },
})
