import * as github from '@actions/github'
import * as core from '@actions/core'

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
  const { pull_request, repository }: WebhookPayload = github.context.payload
  const author: string = pull_request?.user?.login || ''
  const owner: string = repository?.owner.login || ''
  const repo = repository?.name || ''

  // if reviewers param is provided
  const reviewers: string = core.getInput('reviewers')
  if (reviewers) {
    const reviewersList: string[] = reviewers.split(',')
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
  return filterAuthorFromReviewerList(collaborators, author)
}

export async function requestReviewer(): Promise<unknown> {
  // Setup
  const { pull_request, repository }: WebhookPayload = github.context.payload
  const pull_number: number = pull_request?.number || 0
  const owner: string = repository?.owner.login || ''
  const repo: string = repository?.name || ''

  const github_token: string = core.getInput('github_token')
  const octokit: InstanceType<typeof GitHub> = github.getOctokit(github_token)

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
