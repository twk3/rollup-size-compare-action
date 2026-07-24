import {createReadStream} from 'fs'
import {resolve} from 'path'
import {parseChunked} from '@discoveryjs/json-ext'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<any> {
  try {
    const path = resolve(process.cwd(), statsFilePath)
    return await parseChunked(createReadStream(path))
  } catch (error) {
    if (error instanceof Error) {
      // @actions/core is ESM-only, so it must be loaded via dynamic import
      // from this CommonJS module. The eager webpack mode keeps it inlined in
      // the single ncc bundle rather than emitting a separate async chunk.
      const core = await import(/* webpackMode: "eager" */ '@actions/core')
      core.warning(error)
    }
    return {assets: [], chunks: undefined}
  }
}
