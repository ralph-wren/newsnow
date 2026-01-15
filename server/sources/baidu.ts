interface Res {
  data: {
    cards: {
      content: {
        isTop?: boolean
        word: string
        rawUrl: string
        desc?: string
      }[]
    }[]
  }
}

export default defineSource(async (page, size) => {
  const rawData: string = await myFetch(`https://top.baidu.com/board?tab=realtime`)
  const jsonStr = (rawData as string).match(/<!--s-data:(.*?)-->/s)
  const data: Res = JSON.parse(jsonStr![1])

  const allItems = data.data.cards[0].content.filter(k => !k.isTop).map((k) => {
    return {
      id: k.rawUrl,
      title: k.word,
      url: k.rawUrl,
      extra: {
        hover: k.desc,
      },
    }
  })

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit
  return { items: allItems.slice(start, end) }
})
