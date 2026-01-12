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

export default defineSource(async () => {
  const res = await myFetch<RedditResponse>("https://www.reddit.com/r/popular.json")
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
