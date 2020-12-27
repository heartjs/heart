import { createEvent, createInitialEvent } from '@heartjs/heart'

export const orderCreated = createInitialEvent<{ id: string }>('orderCreated')
export const orderUpdated = createEvent<{ test: string }>('orderUpdated')
