import { setOutput, setFailed } from '@actions/core'

import { requestNewReviewer, listRequestedReviewers } from './utils'

async function run(): Promise<void> {
  try {
    const previouslyRequestedReviewers = await listRequestedReviewers()

    if (previouslyRequestedReviewers.length < 1) {
      // No reviewers yet, assign one
      const requestedNewReviewer = await requestNewReviewer()
      setOutput('requestedNewReviewer', requestedNewReviewer)
    }

    // Reviewer already assigned, do nothing
    setOutput('previouslyRequestedReviewers', previouslyRequestedReviewers)
  } catch (error) {
    setFailed(error)
  }
}

run()
