import type { HiCommand } from '../../types'
import bam from './bam'
import gecko from './gecko'
import i18n from './i18n'

export default [...bam, ...gecko, ...i18n] satisfies HiCommand[]
