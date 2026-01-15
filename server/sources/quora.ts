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
  try {
    const rss = await rss2json("https://www.quora.com/rss")
    if (!rss || !rss.items) return []
    return rss.items.map(item => ({
      id: item.id || item.link,
      title: formatValue(item.title) || "",
      url: item.link,
      extra: {
        date: formatValue(item.created),
      },
    }))
  } catch (e) {
    console.error("Quora fetch failed", e)
    return []
  }
})
