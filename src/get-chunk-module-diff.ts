import {chunkModuleNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getChunkModuleDiff(
  oldStats: any,
  newStats: any
): WebpackStatsDiff | null {
  return webpackStatsDiff(
    chunkModuleNameToSizeMap(oldStats),
    chunkModuleNameToSizeMap(newStats)
  )
}
