interface Res {
  data: {
    ClusterIdStr: string
    Title: string
    HotValue: string
    Image: {
      url: string
    }
    LabelUri?: {
      url: string
    }
  }[]
}

export default defineSource(async (page, size) => {
  const url = "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc"
  const res: Res = await myFetch(url)

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit

  const items = res.data.slice(start, end)
    .map((k) => {
      return {
        id: k.ClusterIdStr,
        title: k.Title,
        url: `https://www.toutiao.com/trending/${k.ClusterIdStr}/`,
        extra: {
          icon: k.LabelUri?.url,
        },
      }
    })
  return { items }
})
