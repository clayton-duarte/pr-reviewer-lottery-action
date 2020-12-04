import { setOutput, setFailed } from '@actions/core'

import { requestReviewer } from './utils'

async function run(): Promise<void> {
  try {
    const requestReviewersResult: unknown = await requestReviewer()
    setOutput('requestReviewersResult', requestReviewersResult)
  } catch (error) {
    setFailed(error)
  }
}

run()
