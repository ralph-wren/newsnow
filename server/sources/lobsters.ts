import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

interface LobstersItem {
  short_id: string
  created_at: string
  title: string
  url: string
  score: number
  comment_count: number
  description: string
  submitter_user: string
  tags: string[]
}

export default defineSource(async () => {
  const items = await myFetch<LobstersItem[]>("https://lobste.rs/hottest.json")
  if (!items) return []
  return items.map(item => ({
    id: item.short_id,
    title: item.title,
    url: item.url,
    extra: {
      date: item.created_at,
      info: `${item.submitter_user} · ⬆${item.score} · 💬${item.comment_count}`,
      hover: item.description,
    },
  }))
})
