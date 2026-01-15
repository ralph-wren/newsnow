import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

export default defineSource(async () => {
  const rss = await rss2json("https://www.quora.com/rss")
  return rss?.items.map(item => ({
    id: item.id,
    title: item.title,
    url: item.link,
    extra: {
      date: item.created
    }
  })) || []
})
