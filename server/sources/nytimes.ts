import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

function formatCategory(category: any): string | undefined {
  if (!category || !Array.isArray(category) || category.length === 0) return undefined
  return category.map((c: any) => (typeof c === "string" ? c : c.$text || c._ || "")).filter(Boolean).join(" · ")
}

export default defineSource(async () => {
  const rss = await rss2json("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml")
  if (!rss) return []
  return rss.items.map(item => ({
    id: item.id || item.link,
    title: item.title,
    url: item.link,
    extra: {
      date: item.created,
      info: formatCategory(item.category),
    },
  }))
})
