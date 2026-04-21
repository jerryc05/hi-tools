import { CustomEvent as NodeCustomEvent } from 'node:util'

if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = NodeCustomEvent
}
