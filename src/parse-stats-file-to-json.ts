import {createReadStream} from 'fs'
import {resolve} from 'path'
import {parseChunked} from '@discoveryjs/json-ext'
import * as core from '@actions/core'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<any> {
  try {
    const path = resolve(process.cwd(), statsFilePath)
    return await parseChunked(createReadStream(path))
  } catch (error) {
    if (error instanceof Error) {
      core.warning(error)
    }
    return {assets: [], chunks: undefined}
  }
}
