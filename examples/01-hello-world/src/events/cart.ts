import { createInitialEvent, createEvent } from '@heartjs/heart'

export const cartCreated = createInitialEvent('cartCreated')
export const cartProductAdded = createEvent('cartProductAdded')
export const cartProductRemoved = createEvent('cartProductRemoved')
