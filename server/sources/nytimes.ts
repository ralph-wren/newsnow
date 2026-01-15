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

function formatCategory(category: any): string | undefined {
  if (!category) return undefined
  if (typeof category === "string") return category
  if (Array.isArray(category)) {
    const result = category.map((c: any) => {
      if (typeof c === "string") return c
      if (c && typeof c === "object") {
        return c.$text || c._ || c.term || c["#text"] || ""
      }
      return ""
    }).filter(Boolean)
    return result.length > 0 ? result.join(" · ") : undefined
  }
  if (typeof category === "object") {
    return category.$text || category._ || category.term || category["#text"] || undefined
  }
  return undefined
}

export default defineSource(async () => {
  const rss = await rss2json("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: formatValue(item.title) || "",
    url: item.link,
    extra: {
      date: formatValue(item.created),
      info: formatCategory(item.category),
    },
  }))
})
