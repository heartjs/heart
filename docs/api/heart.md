# Aggregate

## `createContext`

### Overview

Tie everything together

```typescript
createHeart(payload: Payload<Dependencies>)
```

where

```typescript
interface Payload<Dependencies> {
  contexts: {
    [key: string]: Context
  }

  eventStore: {
    saveEvents: (events: [Event]) => Promise<void | never>
  }

  bag?: Dependencies

  options?: {
    verbose: boolean
  }
}
```

---

#### `contexts`

Object which contain all required contexts.

```typescript
interface Payload<Dependencies> {
  contexts: {
    [key: string]: Context
  }
  // ...
}
```

---

#### `eventStore`

Required dependency to be able to persist your events. There can be any type of database such as `firebase`, `mongodb`, `postgresql` etc

```typescript
interface Payload<Dependencies> {
  // ...
  eventStore: {
    saveEvents: (events: [Event]) => Promise<void | never>
  }
  // ...
}
```

---

#### `bag`

Object with all dependencies required in your contexts. This allow you to use **Dependency Injection** or you can call all dependencies directly in contexts and just mock them while testing.

```typescript
interface Payload<Dependencies> {
  // ...
  bag?: Dependencies
  // ...
}
```

---

#### `options`

Set of options to customize `heart`

```typescript
interface Payload<Dependencies> {
  // ...
  options?: {
    verbose: boolean // enable verbose logging while `heart` is running
  }
}
```

---

### Usage

```typescript
const { commands, dispatch } = createHeart({
  contexts: { loyalty },

  // example with firestore database
  eventStore: {
    saveEvents: async (events) => {
      const batch = firestore.batch()

      events.forEach((event) => {
        const ref = firestore.collection('events').doc(event.meta.id)
        batch.set(ref, event)
      })

      await batch.commit()
    },
  },

  bag: {
    userRepository: { /* userRepository implementation */ },
  },
})

// should be used in your app
export { commands, dispatch }
```
