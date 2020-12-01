import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
import { GitHub } from '@actions/github/lib/utils'

import { listEligibleReviewers } from './utils'

async function run(): Promise<void> {
  try {
    // SETUP
    const github_token: string = core.getInput('github_token')
    const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)

    const { pull_request, repository }: WebhookPayload = github.context.payload
    const pull_number: number = pull_request?.number || 0
    const owner: string = repository?.owner.login || ''
    const repo: string = repository?.name || ''

    // ACTION
    const reviewers = await listEligibleReviewers()

    //octokit.github.io/rest.js/v18#pulls-request-reviewers
    const result = await octokit.pulls.requestReviewers({
      pull_number,
      reviewers,
      owner,
      repo
    })

    core.setOutput('result', result)
  } catch (error) {
    core.setFailed(error)
  }
}

run()
