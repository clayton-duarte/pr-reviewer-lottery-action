import {getInput, debug, setOutput, setFailed} from '@actions/core'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {GitHub} from '@actions/github/lib/utils'
import {getOctokit, context} from '@actions/github'

function formatMessage(obj: unknown, message = '>>>'): string {
  return `${message}: ${JSON.stringify(obj, null, 2)}`
}
async function run(): Promise<void> {
  try {
    // SETUP
    const myToken: string = getInput('myToken')
    const pushPayload: WebhookPayload = context.payload
    const octokit: InstanceType<typeof GitHub> = getOctokit(myToken)
    debug(formatMessage(pushPayload, 'pushPayload'))

    const workflowRuns = await octokit.actions.listWorkflowRuns()
    debug(formatMessage(workflowRuns, 'workflowRuns'))

    setOutput('time', new Date().toTimeString())
  } catch (error) {
    setFailed(error.message)
  }
}

run()
