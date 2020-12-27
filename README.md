Heavily under development. All API are not stable yet. We are figuring out how to make API more fluid and simple.

If you want contribute – welcome. But **DO NOT USE** this in production.

---

# Heart

Lightweight isolated business logic processor for monolith projects.

Built with `event sourcing` pattern in mind this library will help you build reliable logic with the help of `Domain Driven Design`.

## Motivation

Typescript is widely distributed on backend and frontend. Over the past few years, we have received awesome libraries like `redux`, `express`, `nestjs` etc. But all of them do not answer the question "how to create isolated reusable business logic?". And in my opinion they all focus on `infrastracture` over `domain` layer.

That's means you have to create lots of boilerplate code to introduce even the smallest feature.

By creating the `heartjs`, I trying to solve those issues.

### Pros

- Can be used with `redux`, `express`, `nestjs` or any other infrastracture library you like.
- `heartjs` provides clear concepts for whole team. So your codebase will be understandable for develop and maintain.
- Codebase can scale rapidly without any issues for development speed.

### Cons

- You have to be familiar with `event sourcing` and `cqrs` patterns or `redux` library for front-end (which uses the same concepts).
- Developers have to be a bit more skilled to use this library.

---

## Installation

`npm i @heartjs/heart`

or

`yarn add @heartjs/heart`

---

## Concepts

For more information you can researc topic `Domain Driven Design (DDD)` invented by Eric Evans. I sugges you to read [Big Blue Book](https://www.amazon.com/gp/product/B00794TAUG/ref=dbs_a_def_rwt_bibl_vppi_i0)

### Domain

The main concept you are working on right now. For example `ecommerce`, `delivery`, `logistics` etc.

### Events

Facts which happens in your domain. For example `order created`, `delivery started` etc.

Should always be called in the past tense.

### Aggregates

The main entities of your domain. For example `order`, `cart` etc.

### Command Handlers

The API "endpoints". For example `create order`, `add contact info to order`, `add product to cart` etc.

### Event Handlers

Side effects of your domain. For example `send notification about created order`, `send email for abandoned cart` etc

---

## Usage

### 1. Create `events` of your domain

You can use `event storming` technique to make it clear what happens in your domain.

### 2. Think where boundaries of your `context`

### 3. Create `aggregates` required in `context`

### 4. Wire everything together

---

## How does it works

<!-- TODO: add working scheme here -->

1. User dispatch `command`
2. `heart` decides which `context` should handle command
3. `context` call required `commandHandler`
3. `commandHandler` validate `command`
4. `commandHandler` load or create `aggregate`
5. `commandHandler` call required methods of `aggregate`
7. `heart` process `events` through `eventHandlers`
8. `heart` return response to user

### Included components

- `events` – first class citizens of this library.
- `aggregates` – includes all of your business logic and invariants
- `commandHandlers` – provide API and validations
- `eventHandlers` – take care of all side-effects

---

## TODO

- [x] add support of **event** versioning
- [x] add support of **sagas**
  - already handled by command handlers in contexts
- [ ] validate uniqueness of `commandHandlers`
- [ ] protect concurrency transactions in `commandHandlers`
- [ ] add example/support of **read side**
- [ ] ? add `middlewares` which will trigger before **commandHandlers**
- [ ] ? add `middlewares` which will trigger before **eventHandlers**
- [ ] add `heartjs-firebase-adapter` which will implement **eventStore** for firebase
- [ ] add `heartjs-memory-adapter` which will implement **eventStore** for inmemory storage
- [ ] add `heartjs-react-adapter` which will implement **eventStore** for react context
