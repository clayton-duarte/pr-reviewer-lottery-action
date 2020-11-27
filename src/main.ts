import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
// import { GitHub } from '@actions/github/lib/utils'

import { formatMessage } from './utils'

async function run(): Promise<void> {
  // core.debug('start...')
  try {
    // SETUP
    const github_token: string = core.getInput('github_token')
    core.debug(formatMessage(github_token != null, 'github_token exists'))

    const pushPayload: WebhookPayload = github.context.payload
    const author = pushPayload.sender?.login
    core.debug(formatMessage(author, 'author'))

    // const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)
    // const workflowRuns = await octokit.actions.listWorkflowRuns()
    // core.debug(formatMessage(workflowRuns, 'workflowRuns'))

    core.setOutput('author', author)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
