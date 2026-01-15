import { myFetch } from "#/utils/fetch"
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
  const token = process.env.TWITTER_BEARER_TOKEN

  if (token) {
    try {
      // API v2 Search Recent
      const res = await myFetch<any>("https://api.twitter.com/2/tweets/search/recent?query=%23trending%20-is:retweet&max_results=20&tweet.fields=created_at,public_metrics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res && res.data) {
        return res.data.map((tweet: any) => ({
          id: tweet.id,
          title: tweet.text,
          url: `https://twitter.com/i/web/status/${tweet.id}`,
          extra: {
            info: `❤️ ${tweet.public_metrics?.like_count || 0} · 🔁 ${tweet.public_metrics?.retweet_count || 0}`,
            date: tweet.created_at,
          },
        }))
      }
    } catch (e) {
      console.error("Twitter API failed", e)
    }
  }

  // Fallback to Nitter RSS
  try {
    const nitterHost = process.env.NITTER_HOST || "https://nitter.net"
    const rss = await rss2json(`${nitterHost}/search/rss?f=tweets&q=%23trending`)

    if (!rss || !rss.items) return []

    return rss.items.map(item => ({
      id: item.id || item.link,
      title: formatValue(item.title) || "",
      url: item.link ? item.link.replace(nitterHost.replace("https://", "").replace("http://", ""), "twitter.com") : "",
      extra: {
        date: formatValue(item.created),
      },
    }))
  } catch (e) {
    console.error("Nitter RSS failed", e)
    return []
  }
})
