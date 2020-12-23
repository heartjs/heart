Heavily under development. All API are not stable yet. We are figuring out how to make API more fluid and simple.

If you want contribute – welcome. But **DO NOT USE** this in production.

---

# Heart

Lightweight isolated business logic processor for monolith projects built with `event sourcing pattern` in mind.

It will help you build reliable logic with the help of Domain-Driven-Design.

## Motivation

Typescript is widely distributed on backend and frontend. Over the past few years, we have received awesome libraries/frameworks like `react`, `redux`, `express`, `nestjs` etc. But all of them do not answer the question "how to create isolated business logic that can be reused over backend and frontend?"

By creating the current library, we tried to answer this question.

## Included components

1. `Event` and `Command` are the first tier citizens of this library. All logic build with the help of these guys.
2. `Aggregate` is a heart of your domain. All the logic happens here.
3. `CommandHandler` and `EventHandler` aka "controllers" of the domain.
4. `Bus` is a infrastracture layer.

More details will be added a bit later. Once we create first stable version.
