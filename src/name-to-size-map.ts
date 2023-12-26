import type {Sizes} from './types'

function findAllChildren(start: any = {}): any {
  return start.children ? start.children.flatMap(findAllChildren) : [start]
}

function trimPath(input: string): string {
  if (!input) {
    return ''
  }

  return input.replace(/.*node_modules/, '/node_modules')
}

export function assetNameToSizeMap(statAssets: any = {}): Map<string, Sizes> {
  return new Map(
    statAssets?.tree?.children.map((asset: any) => {
      const children = findAllChildren(asset)
      let size = 0
      let gzipSize: number | null = statAssets.options.gzip ? 0 : null
      for (const mod of children) {
        size += statAssets.nodeParts[mod.uid].renderedLength
        if (statAssets.options.gzip) {
          gzipSize += statAssets.nodeParts[mod.uid].gzipLengh
        }
      }

      return [
        trimPath(asset.name),
        {
          size,
          gzipSize
        }
      ]
    })
  )
}

export function chunkModuleNameToSizeMap(
  statChunks: any = {}
): Map<string, Sizes> {
  if (!statChunks?.tree) {
    return new Map()
  }
  return new Map(
    findAllChildren(statChunks.tree).map((mod: any) => {
      const modInfo = statChunks.nodeParts[mod.uid]
      return [
        trimPath(statChunks.nodeMetas[modInfo.metaUid].id),
        {
          size: modInfo.renderedLength ?? 0,
          gzipSize: statChunks.options.gzip ? modInfo.gzipLengh : null
        }
      ]
    })
  )
}
