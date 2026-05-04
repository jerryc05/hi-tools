import type { CommandModule } from 'yargs'

export type HiCmd<
  T = Record<string, unknown>,
  U = Record<string, unknown>,
> = CommandModule<T, U & { verbose?: boolean }>
