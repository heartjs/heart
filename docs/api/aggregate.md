# Aggregate

## `createAggregate`

### Overview

Create main entity to work with.

### Description

```typescript
createAggregate(payload: Payload<State>)
```

where

```typescript
interface Payload<State> {
  name: string

  initialState: State

  onCreate?: (payload: any) => [Event]

  actions: {
    [key: string]: (state: State, payload: any) => [Event]
  }

  reducers: {
    [eventType: string]: (state: State, event: Event) => State
  }
}
```

To use aggregate you have to `create(Payload)` or `loadFromHistory([Event])`.

```typescript
const user = createAggregate({ /* ... */ })

const currentUser = user.create({
  id: 'some-user-id',
  name: 'John Dou',
  email: 'johndou@email.com',
})

// or

const currentUser = user.loadFromHistory([
  userCreated({ id: 'current-user-id' }),
  userNameChanged({ name: 'John Dou' }),
])
```

---

#### `name`

Unique name of aggregate, for example `cart` or `order`

```typescript
interface Payload<State> {
  name: string
  // ...
}
```

---

#### `initialState`

Initial state of aggregate

```typescript
interface Payload<State> {
  // ...
  initialState: State
  // ...
}
```

---

#### `onCreate` (optional)

Hook which called when `aggregate.create()` method used.<br />
Have to return result of `createInitialEvent` function.

```typescript
interface Payload<State> {
  // ...
  onCreate?: (payload: any) => [Event]
  // ...
}
```

---

#### `actions`

Set of methods to call. Should return array of `events`

```typescript
interface Payload<State> {
  // ...
  actions: {
    [key: string]: (state: State, payload: any) => [Event]
  }
  // ...
}
```

---

#### `reducers`

Used to build the state of aggregate from provided events.

```typescript
interface Payload<State> {
  // ...
  reducers: {
    [eventType: string]: (state: State, event: Event) => State
  }
}
```

---

### Usage

```typescript
const user = createAggregate({
  name: 'user',

  initialState: {
    id: '',
    name: '',
  },

  onCreate: ({ id }) => {
    return [userCreated({ id })]
  },

  actions: {
    changeName: (_, { name }) => {
      return [userNameChanged({ name })]
    },
  },

  reducers: {
    [userCreated.type]: (state, event) => ({
      ...state,
      id: event.payload.id,
    }),

    [userNameChanged.type]: (state, event) => ({
      ...state,
      name: event.payload.name,
    }),
  },
})
```
