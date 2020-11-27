import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
import { GitHub } from '@actions/github/lib/utils'

// import { formatMessage } from './utils'

async function run(): Promise<void> {
  try {
    // SETUP
    const github_token: string = core.getInput('github_token')
    const possible_reviewers: string = core.getInput('possible_reviewers')
    const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)

    const pushPayload: WebhookPayload = github.context.payload
    const pull_number: number = pushPayload.pull_request?.number || 0
    const repo: string = pushPayload.repository?.name || ''
    const owner: string = pushPayload.sender?.login || ''

    // ACTION
    const reviewers_list = possible_reviewers.split(',')
    const reviewers = reviewers_list.filter((login) => login !== owner)
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
