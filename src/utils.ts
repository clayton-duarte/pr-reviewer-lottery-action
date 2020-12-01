import * as github from '@actions/github'
import * as core from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
import { GitHub } from '@actions/github/lib/utils'

export function formatMessage(obj: unknown, message = '>>>'): string {
  return `${message} >> ${JSON.stringify(obj, null, 2)}`
}

function filterAuthorFromReviewerList(
  list: string[],
  author: string
): string[] {
  return list.filter((login) => login !== author)
}

export async function listEligibleReviewers(): Promise<string[]> {
  // SETUP
  const { pull_request, repository }: WebhookPayload = github.context.payload
  const project_id: number = pull_request?.base?.repo?.id || 0
  const author: string = pull_request?.user?.login || ''
  const owner: string = repository?.owner.login || ''
  const repo = repository?.name || ''
  core.debug(formatMessage(project_id, 'project_id'))
  core.debug(formatMessage(repository, 'repository'))
  core.debug(formatMessage(repo, 'repo'))

  // if reviewers param is provided
  const reviewers: string = core.getInput('reviewers')
  if (reviewers) {
    const reviewersList: string[] = reviewers.split(',')
    core.debug(formatMessage(reviewersList, 'reviewersList'))
    return filterAuthorFromReviewerList(reviewersList, author)
  }

  // else, retrieve all collaborators
  const github_token: string = core.getInput('github_token')
  const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)
  const { data } = await octokit.repos.listCollaborators({
    owner,
    repo
  })

  const collaborators = data.map(({ login }) => login)
  core.debug(formatMessage(collaborators, 'collaborators'))
  return filterAuthorFromReviewerList(collaborators, author)
}
