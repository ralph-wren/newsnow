import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

interface RedditItem {
  data: {
    id: string
    title: string
    permalink: string
    url: string
    score: number
    num_comments: number
    thumbnail: string
    subreddit_name_prefixed: string
  }
}

interface RedditResponse {
  data: {
    children: RedditItem[]
  }
}

let accessToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET

  if (!clientId || !clientSecret) return null

  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const res = await myFetch<{ access_token: string; expires_in: number }>("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    })

    if (res && res.access_token) {
      accessToken = res.access_token
      tokenExpiresAt = Date.now() + res.expires_in * 1000 - 60000 // Buffer 1 min
      return accessToken
    }
  } catch (e) {
    console.error("Failed to get Reddit access token", e)
  }
  return null
}

export default defineSource(async () => {
  const token = await getAccessToken()
  let url = "https://www.reddit.com/r/popular.json"
  let headers: Record<string, string> = {}

  if (token) {
    url = "https://oauth.reddit.com/r/popular"
    headers = { Authorization: `Bearer ${token}` }
  }

  const res = await myFetch<RedditResponse>(url, { headers })
  return res.data.children.map(item => ({
    id: item.data.id,
    title: item.data.title,
    url: `https://www.reddit.com${item.data.permalink}`,
    extra: {
      info: `${item.data.subreddit_name_prefixed} · ⬆${item.data.score} · 💬${item.data.num_comments}`,
      icon: item.data.thumbnail && item.data.thumbnail.startsWith("http") ? item.data.thumbnail : undefined,
    },
  }))
})
