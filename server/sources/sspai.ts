interface Res {
  data: {
    id: number
    title: string
  }[]
}

export default defineSource(async (page, size) => {
  const limit = size || 30
  const p = page || 1
  const offset = (p - 1) * limit
  const timestamp = Date.now()
  const url = `https://sspai.com/api/v1/article/tag/page/get?limit=${limit}&offset=${offset}&created_at=${timestamp}&tag=%E7%83%AD%E9%97%A8%E6%96%87%E7%AB%A0&released=false`
  const res: Res = await myFetch(url)
  const items = res.data.map((k) => {
    const url = `https://sspai.com/post/${k.id}`
    return {
      id: k.id,
      title: k.title,
      url,
    }
  })
  return { items }
})
