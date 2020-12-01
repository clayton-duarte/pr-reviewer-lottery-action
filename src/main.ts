import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
import { GitHub } from '@actions/github/lib/utils'

import { formatMessage } from './utils'

async function run(): Promise<void> {
  try {
    // SETUP
    const github_token: string = core.getInput('github_token')
    const possible_reviewers: string = core.getInput('possible_reviewers')
    const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)

    const { pull_request, repository }: WebhookPayload = github.context.payload
    const author: string = pull_request?.user?.login || ''
    const pull_number: number = pull_request?.number || 0
    const owner: string = repository?.owner.login || ''
    const repo: string = repository?.name || ''

    core.debug(formatMessage(author, 'author'))
    core.debug(formatMessage(owner, 'owner'))

    // ACTION
    const reviewers_list = possible_reviewers.split(',')
    const reviewers = reviewers_list.filter((login) => login !== author)
    core.debug(formatMessage(reviewers_list, 'reviewers_list'))
    core.debug(formatMessage(reviewers, 'reviewers'))

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
