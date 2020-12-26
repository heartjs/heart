export function createAction<Payload>(type: string) {
  function action(payload?: Payload) {
    return {
      type,
      payload,
    }
  }

  action.type = type

  return action
}
