# Events

- [createInitialEvent](#createInitialEvent)
- [createEvent](#createEvent)

## `createInitialEvent`

### Overview

Create initial event with required `id` property. Layer will be used to initiate aggregates and provide IDs to them.

### Description

```typescript
createInitialEvent<Payload>(topic: string, options: Options)
```

where

```typescript
interface Options {
  version?: number // default = 1
}

// and

interface Payload {
  id: string
  // ...your properties here
}
```

### Usage

```typescript
const userCreated = createInitialEvent('user-created', { version: 1 })

// or

const userCreated = createInitialEvent('user-created')
```

and then

```typescript
userCreated({ id: 'current-user-id' })
```

Later `heartjs` will provide other required properties to event, such as `aggregateId`, `aggregateName` and `meta`.

Final event stored event will have the following shape:

```typescript
interface Event<Payload> {
  aggregateId: string // linked aggregate id
  aggregateName: string // linked aggregate name
  payload: Payload // provided payload
  meta: {
    id: string // event id
    timestamp: string // iso date
    version: number // provided version of event
  }
}
```

---

## `createEvent`

### Overview

The same as `createInitialEvent` but without any requirements in payload

### Description

```typescript
createEvent<Payload>(topic: string, options: Options)
```

where

```typescript
interface Options {
  version?: number // default = 1
}

// and

interface Payload {
  // ...your properties here
}
```

### Usage

```typescript
const userNameChanged = createEvent('user-name-changed', { version: 1 })

// or

const userNameChanged = createEvent('user-name-changed')
```

and then

```typescript
userNameChanged({ name: 'John Dou' })
```
