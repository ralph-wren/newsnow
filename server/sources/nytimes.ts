import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

export default defineSource(async () => {
  const rss = await rss2json("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: item.title,
    url: item.link,
    extra: {
      date: item.created,
      info: item.category?.join(" · "),
    },
  }))
})
