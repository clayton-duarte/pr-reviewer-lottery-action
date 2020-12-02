import { setOutput, setFailed } from '@actions/core'

import { requestReviewer } from './utils'

async function run(): Promise<void> {
  try {
    const result = await requestReviewer()
    setOutput('result', result)
  } catch (error) {
    setFailed(error)
  }
}

run()
