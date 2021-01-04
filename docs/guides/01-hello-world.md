# Getting Started

> This page is overview of `heartjs` library

## Installation

`npm i @heartjs/heart`
</br>or</br>
`yarn add @heartjs/heart`

### Overview ([Full example here](https://github.com/heartjs/heart/tree/main/examples/01-hello-world/src))

All business logic will be built according to the following hierarchy:

- **events** – are first-class citizens in your domain. In other words, these are facts that happen in the domain. For example, `order has been created`, `product has been added to cart`, etc.
- **domain, or heart** – is the main activity of your business
- **context** – the module of the domain, for example, `order processing`, `delivery`, etc. Domain can have multiple contexts. Everything inside the context must be encapsulated.
- **aggregate** – the main entities exists in context, for example, `order`, `cart`, etc. Context can have multiple aggregates.

---

Next, we'll look at a simple example: <br/>
The user can `add` products to the `cart` and `delete` them

Based on this sentence, we can determine that our **domain** is something related to e-commerce. To start, we can create a basic `common` context, and later rename it more correctly. <br/>
Required **events**: `cartCreated`, `cartProductAdded` and `cartProductRemoved` <br/>
First, let's create the last two:

```typescript
// cartEvents.ts
import { createEvent } from '@heartjs/heart'

export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

And the event `cartCreated` will be the initial one, which will set a unique `id` for the **aggregate**.

```diff
// cartEvents.ts
+ import { createInitialEvent, createEvent } from '@heartjs/heart'
- import { createEvent } from '@heartjs/heart'

+ export const cartCreated = createInitialEvent('cartCreated')
export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

The final file with events will look like this:

```typescript
// cartEvents.ts
import { createInitialEvent, createEvent } from '@heartjs/heart'

export const cartCreated = createInitialEvent('cartCreated')
export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

---

And to create these **events** we need a **aggregate** `cart`.

```typescript
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [],
  }
})
```

Which will have the following methods: `cart.create()`, `cart.addProduct()` and `cart.removeProduct()`. <br />
Again, let's create the last two first:

```diff
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [],
  },

+  actions: {
+    addProduct(state, { product }) {
+       return [cartProductAdded({ product })]
+    },
+
+    removeProduct(state, { product }) {
+       return [cartProductRemoved({ product })]
+    }
+  }
})
```

`cart.create()` is a standard method that is available in the aggregate by default. To handle this method, we need to add a hook that will be called when the aggregate is created. <br />
It should return the result of calling the `createInitialEvent()` function.

```diff
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [],
  },

+  onCreate({ id }) {
+    return [cartCreated({ id })]
+  },

  actions: {
    addProduct(state, { product }) {
      return [cartProductAdded({ product })]
    },

    removeProduct(state, { product }) {
      return [cartProductRemoved({ product })]
    }
  }
})
```

An aggregate with prepared methods will look like this:

```typescript
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [],
  },

  onCreate(id) {
    return [cartCreated({ id })]
  },

  actions: {
    addProduct(state, { product }) {
      return [cartProductAdded({ product )]
    },

    removeProduct(state, { product }) {
      return [cartProductRemoved({ product })]
    }
  }
})
```

But we are not finished yet. To make aggregate work correctly, we have to somehow update its state. The concept of `reducers` is used for this. <br />
They are written as follows:

```diff
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: ...',
  initialState: {...},
  onCreate(id) {...},
  actions: {...},

+  reducers: {
+    [cartCreated]: (state, event) => ({
+      ...state,
+      id: event.payload.id,
+    })
+  }
})
```

For every event corresponding `reducer` must be added.

```diff
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: ...',
  initialState: {...},
  onCreate(id) {...},
  actions: {...},

  reducers: {
    [cartCreated.type]: (state, event) => ({
      ...state,
      id: event.payload.id,
    }),
+
+    [cartProductAdded.type]: (state, event) => ({
+      ...state,
+      products: state.products.concat([event.payload.product])
+    }),
+
+    [cartProductRemoved.type]: (state, event) => ({
+      ...state,
+      products: state.products.filter((product) => product !== event.payload.product)
+    })
  }
})
```

The final `cart` aggregate will look like this:

```typescript
// cart.ts
import { createAggregate } from '@heartjs/heart'

export const cart = createAggregate({
  name: 'cart',

  initialState: {
    id: '',
    products: [],
  },

  onCreate(id) {
    return [cartCreated({ id })]
  },

  actions: {
    addProduct(state, { product }) {
      return [cartProductAdded({ product )]
    },

    removeProduct(state, { product }) {
      return [cartProductRemoved({ product })]
    }
  },

  reducers: {
    [cartCreated.type]: (state, event) => ({
      ...state,
      id: event.payload.id,
    }),

    [cartProductAdded.type]: (state, event) => ({
      ...state,
      products: state.products.concat([event.payload.product])
    }),

    [cartProductRemoved.type]: (state, event) => ({
      ...state,
      products: state.products.filter((product) => product !== event.payload.product)
    })
  }
})
```

---

Next, we need to somehow work with aggregates. To make this happen we will use `contexts`. <br />
Contexts allow us to work with outside world and operate with aggregates. <br />
We don't have any dependencies here. You can create a design that is as convenient as possible for subsequent external use.

```typescript
// common.ts
import { createContext } from '@heartjs/heart'
import { cart } from './cart'

export const common = createContext({
  aggregates: { cart },

  commandHandlers: {
    addProductToCart: async (command) => {
      const aggregate = cart.create({ id: command.cartId })
      aggregate.addProduct(command.product)
      return [aggregate]
    },

    removeProductToCart: async (command) => {
      const aggregate = cart.create({ id: command.cartId })
      aggregate.removeProduct(command.product)
      return [aggregate]
    },
  },
})
```

---

And finally we tie it all together.

```typescript
// index.ts
import { createHeart } from '@heartjs/heart'
import { common } from './common'

const { commands, dispatch } = createHeart({
  contexts: { common },

  // механизм сохранения/загрузки ивентов. Т.е. любой адаптер к базе данных
  eventStore: {
    saveEvents: (events) => {...}
  },
})

export { commands, dispatch }
```

`commands` is an object that stores commands from all contexts. <br />
And `dispatch` is a function that allows you to process these commands.

For example, layer in the code, you can use it like this:

```typescript
// some-other-file.ts
import { commands, dispatch } from './heart'

async function doSomething() {
  const command = commands.addProductToCart({
    cartId: 'some-cart-id',
    product: 'some-product'
  })
  await dispatch(command)
}
```
