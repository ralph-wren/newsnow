import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

function formatDescription(desc: any): string | undefined {
  if (!desc) return undefined
  if (typeof desc === "string") return desc
  if (desc.$text) return desc.$text
  return undefined
}

async function world() {
  const rss = await rss2json("https://feeds.a.dj.com/rss/RSSWorldNews.xml")
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
}

async function opinion() {
  const rss = await rss2json("https://feeds.a.dj.com/rss/RSSOpinion.xml")
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
}

export default defineSource({
  "wsj": world,
  "wsj-world": world,
  "wsj-opinion": opinion,
})
