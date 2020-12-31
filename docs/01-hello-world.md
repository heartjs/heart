# Getting Started

> This page is overview of `heartjs` library

## Installation

`npm i @heartjs/heart`
</br>or</br>
`yarn add @heartjs/heart`

## There are 4 moving pieces

- Events
- Aggregates
- Contexts
- Heart

### Overview

Вся бизнес-логика будет строиться по следующей иерархии:

- **ивенты** – это граждане первого порядка в вашем домене. Другими словами – это факты, которые могут произойти в домене. К примеру `заказ создан`, `товар добавлен в корзину` и т.д.
- **домен, или heart** – это основной вид деятельности вашего бизнеса
- **контекст** – направление деятельности домена, к примеру `обработка заказов`, `доставка` и т.д. В домене может быть несколько контекстов. Самое важное, что всё, что находится внутри контекста должно быть инкапсулировано.
- **агрегат** – основные сущности, которые есть в контексте, к примеру `заказ`, `корзина` и т.д. В контексте может быть несколько агрегатов.

---

Далее мы рассмотрим простой пример: <br/>
Пользователь может `добавлять` и `удалять` товары в `корзине`

Исходя из этого предложения, мы можем определить, что наш **домен** – это что-то связанное с торговлей. Для старта можем создать базовый `common` контекст, а позже переназвать его более правильно. <br/>
**Ивенты**, которые нужны: `cartCreated`, `cartProductAdded` и `cartProductRemoved` <br/>
Для начала создадим последние два:

```typescript
// cartEvents.ts
import { createEvent } from '@heartjs/heart'

export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

А ивент `cartCreated` будет первоначальным, который будет задавать уникальный `id` для **агрегата**.

```diff
// cartEvents.ts
+ import { createInitialEvent, createEvent } from '@heartjs/heart'
- import { createEvent } from '@heartjs/heart'

+ export const cartCreated = createInitialEvent('cartCreated')
export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

Финальный файл с ивентами будет выглядеть так:

```typescript
// cartEvents.ts
import { createInitialEvent, createEvent } from '@heartjs/heart'

export const cartCreated = createInitialEvent('cartCreated')
export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
```

---

И чтобы создавать эти **ивенты** нам нужен **агрегат** `cart`.

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

Который будет иметь следующие методы: `cart.create()`, `cart.addProduct()` и `cart.removeProduct()`. <br />
Опять же, сначала создадим последние два:

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
+    addProduct({ product }) {
+       return [cartProductAdded({ product })]
+    },
+
+    removeProduct({ product }) {
+       return [cartProductRemoved({ product })]
+    }
+  }
})
```

`cart.create()` – стандартный метод, который доступен в агрегате по-умолчанию. Чтобы обрабатывать этот метод нам нужно добавить хук, который будет вызываться при создании агрегата. Он должен возвращать результат вызова функции `createInitialEvent()`

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
    addProduct({ product }) {
      return [cartProductAdded({ product })]
    },

    removeProduct({ product }) {
      return [cartProductRemoved({ product })]
    }
  }
})
```

Агрегат с подготовленными методами будет выглядеть следующим образом:

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
    addProduct(product) {
      return [cartProductAdded({ product )]
    },

    removeProduct(product) {
      return [cartProductRemoved({ product })]
    }
  }
})
```

Но это еще не всё, чтобы агрегат правильно работал, нам нужно как-то обновлять его состояние. Для этого используется концепция `reducers`. <br />
Записываются они следующим образом:

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

Для каждого ивента должен быть добавлен свой `reducer`.

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

Итого финально агрегат `cart` будет выглядеть вот так:

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
    addProduct(product) {
      return [cartProductAdded({ product )]
    },

    removeProduct(product) {
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

Далее нам нужно как-то работать с агрегатами. Для этого существую контексты, которые позволяют работать с внешним миром и оперировать агрегатами. <br />
Здесь у нас нет никаких зависимостей. Можно создавать дизайн максимально удобный для последующего внешнего использования.

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

И финально связываем всё это вместе

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

`commands` – это объект, который хранит комманды из всех контекстов. А `dispatch` – функция, которая позволяет обрабатывать эти команды.

К примеру дальше в коде вы можете использовать это следующим образом:

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
