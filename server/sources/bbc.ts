import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

function formatDescription(desc: any): string | undefined {
  if (!desc) return undefined
  if (typeof desc === "string") return desc
  if (desc.$text) return desc.$text
  return undefined
}

export default defineSource(async () => {
  const rss = await rss2json("http://feeds.bbci.co.uk/news/world/rss.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: item.title,
    url: item.link,
    extra: {
      date: item.created,
      hover: formatDescription(item.description),
    },
  }))
})
