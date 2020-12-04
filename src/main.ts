import { setOutput, setFailed } from '@actions/core'

import { requestReviewer, clearReviewers } from './utils'

async function run(): Promise<void> {
  try {
    const clearResult = await clearReviewers()
    setOutput('clearResult', clearResult)
    const requestResult = await requestReviewer()
    setOutput('requestResult', requestResult)
  } catch (error) {
    setFailed(error)
  }
}

run()
