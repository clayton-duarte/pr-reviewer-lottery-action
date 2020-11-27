import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
// import { GitHub } from '@actions/github/lib/utils'

import { formatMessage } from './utils'

async function run(): Promise<void> {
  core.info('start...')
  try {
    // SETUP
    // const github_token: string = core.getInput('github_token')
    // core.info(formatMessage(github_token != null, 'github_token exists'))

    const pushPayload: WebhookPayload = github.context.payload
    core.info(formatMessage(pushPayload, 'pushPayload'))

    // const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)
    // const workflowRuns = await octokit.actions.listWorkflowRuns()
    // core.info(formatMessage(workflowRuns, 'workflowRuns'))

    core.setOutput('pushPayload', pushPayload)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
