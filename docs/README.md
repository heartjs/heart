!> **Heavily under development.** <br />
All API are not stable yet and can be changed in the future. I'm figuring out how to make API more fluid and simple. <br />
If you want contribute – welcome. But **DO NOT USE** this in production.

<p align="center">
  <img src="https://github.com/heartjs/heart/blob/main/docs/assets/logo.jpg" alt="Logo" width="600px">
</p>

<p align="center">
  <h1 align="center">Heart</h1>
  <h3 align="center">Lightweight isolated business logic processor for monolith projects</h3>
</p>

<p align="center">
  <a href="https://heartjs.github.io/heart/" target="_blank"><strong>View the Docs</strong></a>
</p>

## Motivation

Typescript is widely distributed on backend and frontend. Over the past few years, we have received awesome libraries like `redux`, `express`, `nestjs` etc. But all of them do not answer the question *"how to create isolated reusable business logic?"*.
<br />And in my opinion they all focus on `infrastracture` over `domain` layer. That's means you have to create lots of boilerplate code to introduce even the smallest feature.

By creating the `heartjs`, I'm trying to solve those issues.

### Pros

- Can be used with `redux`, `express`, `nestjs` or any other infrastracture library you like.
- `heartjs` provides clear concepts for whole team. So your codebase will be understandable for developing and maintain.
- Codebase can scale rapidly without any issues for development speed.

### Cons

- You have to be familiar with `event sourcing` and `cqrs` patterns or `redux` library for front-end (which uses the same concepts).
- Developers have to be a bit more skilled to use this library.

---

## Concepts

For more information you can research topic `Domain Driven Design (DDD)` invented by Eric Evans. I suggest you to read [Blue Book](https://www.amazon.com/gp/product/B00794TAUG/ref=dbs_a_def_rwt_bibl_vppi_i0)

In those docs all concepts will be described in context of usage.

### Domain

The main activity you are working on right now. For example `ecommerce`, `delivery`, `logistics` etc.

### Events

Facts which happens in your domain. For example `order created`, `delivery started` etc.

Should always be called in the **past tense**.

### Aggregates

The main entities of your domain. For example `order`, `cart` etc.

### Command Handlers

The API "endpoints". For example `create order`, `add contact info to order`, `add product to cart` etc.

### Event Handlers

Side effects of your domain. For example `send notification about created order`, `send email for abandoned cart` etc.

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

---

## TODO

- [x] add support of **event** versioning
- [ ] validate uniqueness of `commandHandlers`
- [ ] protect concurrency transactions in `commandHandlers`
- [ ] add example/support of **read side**
- [ ] ? add `middlewares` which will trigger before **commandHandlers**
- [ ] ? add `middlewares` which will trigger before **eventHandlers**
- [ ] add `heartjs-firebase-adapter` which will implement **eventStore** for firebase
- [ ] add `heartjs-memory-adapter` which will implement **eventStore** for inmemory storage
- [ ] add `heartjs-react-adapter` which will implement **eventStore** for react context
