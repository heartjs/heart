# Aggregate

## `createContext`

### Overview

Create module of your domain.

```typescript
createContext(payload: Payload<Dependencies>)
```

where

```typescript
interface Payload<Dependencies> {
  aggregates: {
    [key: string]: Aggregate
  }

  commandHandlers: {
    [key: string]: (command: Command, dependencies: Dependencies) => Promise<Aggregate[] | never>
  }

  eventHandlers: {
    [eventType: string]: (event: Event, dependencies: Dependencies) => Promise<void | never>
  }
}
```

---

#### `aggregates`

Object which contain all required aggregates.

```typescript
interface Payload<Dependencies> {
  aggregates: {
    [key: string]: Aggregate
  }
  // ...
}
```

---

#### `commandHandlers`

Object of functions which will be exposed as public API of your domain.

```typescript
interface Payload<Dependencies> {
  // ...
  commandHandlers: {
    [key: string]: (command: Command, dependencies: Dependencies) => Promise<Aggregate[] | never>
  }
  // ...
}
```

---

#### `eventHandlers`

Object of functions which will be called when all events stored successfully.

```typescript
interface Payload<Dependencies> {
  // ...
  eventHandlers: {
    [eventType: string]: (event: Event, dependencies: Dependencies) => Promise<void | never>
  }
}
```

There can be added wildcard event handler which will be called for **all events**.<br />
Example:

```typescript
createContext({
  // ...
  eventHandlers: {
    '*': (event, dependencies) => { /* ... */ }
  }
})
```

---

### Usage

```typescript
const loyalty = createContext({
  aggregates: { user },

  commandHandlers: {
    createUser: async ({ id }, dependencies) => {
      const isUserExists = await dependencies.userRepository.isUserWithIdExists(id)
      if (isUserExists) { /* throw validation error */ }

      const currentUser = user.create({ id })
      return [currentUser]
    },

    changeUserName: async ({ id, name }, dependencies) => {
      const isUserExists = await dependencies.userRepository.isUserWithIdExists(id)
      if (!isUserExists) { /* throw validation error */ }

      const currentUser = await dependencies.userRepository.getById(id)
      currentUser.changeName({ name })
      return [currentUser]
    },
  },
})
```
