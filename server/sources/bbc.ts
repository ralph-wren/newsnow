import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

export default defineSource(async () => {
  const rss = await rss2json("http://feeds.bbci.co.uk/news/world/rss.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: item.title,
    url: item.link,
    extra: {
      date: item.created,
      hover: item.description,
    },
  }))
})
