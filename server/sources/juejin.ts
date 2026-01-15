import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

interface Res {
  data: {
    content: {
      title: string
      content_id: string
    }
    content_counter: {
      hot_rank: number
      view: number
      like: number
      comment_count: number
    }
  }[]
}

export default defineSource(async (page, size) => {
  const url = `https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&spider=0`
  const res: Res = await myFetch(url)

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit

  const items = res.data.slice(start, end).map((k) => {
    const url = `https://juejin.cn/post/${k.content.content_id}`
    return {
      id: k.content.content_id,
      title: k.content.title,
      url,
      extra: {
        info: `🔥${k.content_counter.hot_rank} · 👁${k.content_counter.view} · 👍${k.content_counter.like} · 💬${k.content_counter.comment_count}`,
      },
    }
  })
  return { items }
})
