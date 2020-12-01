import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
// import { GitHub } from '@actions/github/lib/utils'

export function formatMessage(obj: unknown, message = '>>>'): string {
  return `${message}> ${JSON.stringify(obj, null, 2)}`
}

function filterAuthorFromReviewerList(
  list: string[],
  author: string
): string[] {
  return list.filter((login) => login !== author)
}

export async function listEligibleReviewers(): Promise<string[]> {
  // SETUP
  const { pull_request }: WebhookPayload = github.context.payload
  const author: string = pull_request?.user?.login || ''

  // if reviewers param is provided
  const reviewers: string = core.getInput('reviewers')
  if (reviewers) {
    const reviewersList = reviewers.split(',')
    core.debug(formatMessage(reviewersList, 'reviewersList'))
    return filterAuthorFromReviewerList(reviewersList, author)
  }

  // else, retrieve all collaborators
  core.debug(formatMessage(github.context.payload, 'github.context.payload'))
  return []
  // const github_token: string = core.getInput('github_token')
  // const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)
  // const collaborators = await octokit.projects.listCollaborators({
  //   project_id
  // })
  // const collaboratorsLoginList = collaborators.map(({ login }) => login)
  // core.debug(formatMessage(collaboratorsLoginList, 'collaboratorsLoginList'))
  // return filterAuthorFromReviewerList(collaboratorsLoginList, author)
}
