import { context, getOctokit } from '@actions/github'
import { getInput } from '@actions/core'

import { WebhookPayload } from '@actions/github/lib/interfaces'
import { GitHub } from '@actions/github/lib/utils'

export function formatMessage(obj: unknown, message = '>>>'): string {
  return `${message} >> ${JSON.stringify(obj, null, 2)}`
}

export function randomlyReturnReviewer(reviewers: string[]): string {
  const randomIndex = Math.floor(Math.random() * reviewers.length)
  return reviewers[randomIndex]
}

function filterAuthorFromReviewerList(
  list: string[],
  author: string
): string[] {
  return list.filter((login) => login !== author)
}

export async function listEligibleReviewers(): Promise<string[]> {
  // SETUP
  const { pull_request, repository }: WebhookPayload = context.payload
  const author: string = pull_request?.user?.login || ''
  const owner: string = repository?.owner.login || ''
  const repo = repository?.name || ''

  // if reviewers param is provided
  const reviewers: string = getInput('reviewers')
  if (reviewers) {
    const reviewersList: string[] = reviewers.split(',')
    return filterAuthorFromReviewerList(reviewersList, author)
  }

  // else, retrieve all collaborators
  const githubToken: string = getInput('github_token')
  const octokit: InstanceType<typeof GitHub> = getOctokit(githubToken)
  const { data } = await octokit.repos.listCollaborators({
    owner,
    repo
  })

  const collaborators = data.map(({ login }) => login)
  return filterAuthorFromReviewerList(collaborators, author)
}

export async function requestReviewer(): Promise<unknown> {
  // Setup
  const { pull_request, repository }: WebhookPayload = context.payload
  const pull_number: number = pull_request?.number || 0
  const owner: string = repository?.owner.login || ''
  const repo: string = repository?.name || ''

  const github_token: string = getInput('github_token')
  const octokit: InstanceType<typeof GitHub> = getOctokit(github_token)

  // Selects reviewer
  const reviewers = await listEligibleReviewers()
  const selectedReviewer = randomlyReturnReviewer(reviewers)

  // Request review
  const result = await octokit.pulls.requestReviewers({
    reviewers: [selectedReviewer],
    pull_number,
    owner,
    repo
  })

  return result
}
