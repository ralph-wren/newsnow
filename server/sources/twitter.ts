import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"
import { rss2json } from "#/utils/rss2json"

export default defineSource(async () => {
  const token = process.env.TWITTER_BEARER_TOKEN

  if (token) {
    try {
      // API v2 Search Recent
      // Note: "Trending" isn't directly available in v2 free tier mostly, but we can search for #trending or similar.
      // Or if the user has access to trends API (v1.1), they might prefer that, but let's stick to v2 search for safety.
      const res = await myFetch<any>("https://api.twitter.com/2/tweets/search/recent?query=%23trending%20-is:retweet&max_results=20&tweet.fields=created_at,public_metrics", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (res && res.data) {
        return res.data.map((tweet: any) => ({
          id: tweet.id,
          title: tweet.text,
          url: `https://twitter.com/i/web/status/${tweet.id}`,
          extra: {
            info: `❤️ ${tweet.public_metrics?.like_count || 0} · 🔁 ${tweet.public_metrics?.retweet_count || 0}`,
            date: tweet.created_at
          }
        }))
      }
    } catch (e) {
      console.error("Twitter API failed", e)
    }
  }

  // Fallback to Nitter RSS
  // We use a functional public instance. Note: Nitter instances often change or get blocked.
  // Using nitter.net (official) - might be rate limited.
  // Ideally, user should provide a working Nitter instance URL in env if they want this to be reliable without API.
  const nitterHost = process.env.NITTER_HOST || "https://nitter.net"
  const rss = await rss2json(`${nitterHost}/search/rss?f=tweets&q=%23trending`)
  
  return rss?.items.map(item => ({
    id: item.id,
    title: item.title,
    url: item.link.replace(nitterHost.replace("https://", "").replace("http://", ""), "twitter.com"),
    extra: {
      date: item.created
    }
  })) || []
})
