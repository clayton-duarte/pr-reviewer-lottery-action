import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
// import { GitHub } from '@actions/github/lib/utils'

import { formatMessage } from './utils'

async function run(): Promise<void> {
  try {
    // SETUP
    const github_token: string = core.getInput('github_token')
    core.debug(formatMessage(github_token != null, 'github_token exists'))

    const pushPayload: WebhookPayload = github.context.payload
    const pullId: string = pushPayload.pull_request?.id
    core.debug(formatMessage(pullId, 'pullId'))
    const owner: string = pushPayload.sender?.login || ''
    core.debug(formatMessage(owner, 'owner'))
    const repo: string = pushPayload.repository?.name || ''
    core.debug(formatMessage(repo, 'repo'))

    const octokit = github.getOctokit(github_token)
    const pullRequests = await octokit.pulls.list({
      owner,
      repo
    })
    core.debug(formatMessage(pullRequests, 'pullRequests'))

    core.setOutput('owner', owner)
  } catch (error) {
    core.setFailed(error)
  }
}

run()
