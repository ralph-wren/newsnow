import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

async function world() {
  const rss = await rss2json("https://feeds.a.dj.com/rss/RSSWorldNews.xml")
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
      hover: item.description,
    },
  }))
}

export default defineSource({
  "wsj": world,
  "wsj-world": world,
  "wsj-opinion": opinion,
})
