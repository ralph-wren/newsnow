interface Res {
  data: {
    hotNews: {
      contId: string
      name: string
      pubTimeLong: string
    }[]
  }
}

export default defineSource(async (page, size) => {
  const url = "https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar"
  const res: Res = await myFetch(url)

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit

  const items = res.data.hotNews.slice(start, end)
    .map((k) => {
      return {
        id: k.contId,
        title: k.name,
        url: `https://www.thepaper.cn/newsDetail_forward_${k.contId}`,
        mobileUrl: `https://m.thepaper.cn/newsDetail_forward_${k.contId}`,
      }
    })
  return { items }
})
