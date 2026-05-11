import { config } from '../config'

type HubSpotDealResponse = {
  id: string
}

type HubSpotError = {
  status: string
  message: string
  correlationId?: string
  errors?: Array<{ message: string; context?: Record<string, string[]> }>
}

function formatDateOnly(value: Date) {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  const day = String(value.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function createHubSpotDeal(payload: {
  title: string
  programmingLanguage: string
  repositoryUrl: string
  description: string
  deadline: Date
  publishCost: number
  platformReward: number
  authorEmail: string
}) {
  if (!config.HUBSPOT_ACCESS_TOKEN) {
    throw new Error('HUBSPOT_ACCESS_TOKEN is not set')
  }

  const body = {
    properties: {
      dealname: payload.title,
      pipeline: config.HUBSPOT_PIPELINE_ID,
      dealstage: config.HUBSPOT_STAGE_ACTIVE,
      description: payload.description,
      programming_language: payload.programmingLanguage,
      repository_url: payload.repositoryUrl,
      author_email: payload.authorEmail,
      title: payload.title,
      deadline: formatDateOnly(payload.deadline),
      publish_cost: String(payload.publishCost),
      platform_reward: String(payload.platformReward),
      status: 'open',
      ...(config.HUBSPOT_OWNER_ID ? { hubspot_owner_id: config.HUBSPOT_OWNER_ID } : {}),
    },
  }

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as HubSpotDealResponse | HubSpotError
  if (!response.ok) {
    const message = 'message' in data ? data.message : 'HubSpot create deal failed'
    throw new Error(message)
  }

  return data as HubSpotDealResponse
}