import * as core from '@actions/core'

import { requestReviewer } from './utils'

async function run(): Promise<void> {
  try {
    const result = await requestReviewer()
    core.setOutput('result', result)
  } catch (error) {
    core.setFailed(error)
  }
}

run()
