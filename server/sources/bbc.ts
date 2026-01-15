import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

function formatValue(val: any): string | undefined {
  if (!val) return undefined
  if (typeof val === "string") return val
  if (typeof val === "number") return String(val)
  if (val.$text) return val.$text
  if (val._) return val._
  if (val["#text"]) return val["#text"]
  return undefined
}

export default defineSource(async () => {
  const rss = await rss2json("http://feeds.bbci.co.uk/news/world/rss.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: formatValue(item.title) || "",
    url: item.link,
    extra: {
      date: formatValue(item.created),
      hover: formatValue(item.description),
    },
  }))
})
