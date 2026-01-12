import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

interface NeteaseItem {
  title: string
  docid: string
  url: string
  ptime: string
  source: string
  imgsrc: string
  digest: string
  replyCount: number
}

interface NeteaseResponse {
  [key: string]: NeteaseItem[]
}

export default defineSource(async () => {
  const channelId = "T1348647853363"
  const url = `https://c.m.163.com/nc/article/headline/${channelId}/0-40.html`
  const res = await myFetch<NeteaseResponse>(url)
  const items = res[channelId] || []

  return items.map(item => ({
    id: item.docid,
    title: item.title,
    url: item.url,
    pubDate: item.ptime,
    extra: {
      info: item.source + (item.replyCount ? ` · 💬${item.replyCount}` : ""),
      hover: item.digest,
      icon: item.imgsrc,
    },
  }))
})
