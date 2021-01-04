# Heart

Lightweight isolated business logic processor for monolith projects.

Built with `event sourcing` pattern in mind. This library will help you build reliable logic with the help of `Domain Driven Design`.

## Motivation

Typescript is widely distributed on backend and frontend. Over the past few years, we have received awesome libraries like `redux`, `express`, `nestjs` etc. But all of them do not answer the question "how to create isolated reusable business logic?". And in my opinion they all focus on `infrastracture` over `domain` layer.

That's means you have to create lots of boilerplate code to introduce even the smallest feature.

By creating the `heartjs`, I'm trying to solve those issues.

### Pros

- Can be used with `redux`, `express`, `nestjs` or any other infrastracture library you like.
- `heartjs` provides clear concepts for whole team. So your codebase will be understandable for developing and maintain.
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

## Docs

Check docs [here](https://heartjs.github.io/heart/)
