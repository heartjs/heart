import * as R from 'ramda'

/**
 * @todo move topics to generic
 */
export default class Command<Payload> {
  readonly topic: string

  readonly payload: Payload

  public constructor(payload: Payload) {
    this.payload = R.clone(payload)
  }

  public static fromJSON<Input>(input: Input): Command<Input> {
    return new Command(input)
  }

  public toJSON = () => ({
    topic: this.topic,
    payload: this.payload,
  })
}
