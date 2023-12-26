import {assetNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getStatsDiff(
  oldAssetStats: any,
  newAssetStats: any
): WebpackStatsDiff {
  return webpackStatsDiff(
    assetNameToSizeMap(oldAssetStats),
    assetNameToSizeMap(newAssetStats)
  )
}
