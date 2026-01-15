interface Res {
  data: {
    word_list: {
      sentence_id: string
      word: string
      event_time: string
      hot_value: string
    }[]
  }
}

export default defineSource(async (page, size) => {
  const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1"
  const cookie = (await $fetch.raw("https://login.douyin.com/")).headers.getSetCookie()
  const res: Res = await myFetch(url, {
    headers: {
      cookie: cookie.join("; "),
    },
  })

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit

  const items = res.data.word_list.slice(start, end).map((k) => {
    return {
      id: k.sentence_id,
      title: k.word,
      url: `https://www.douyin.com/hot/${k.sentence_id}`,
    }
  })
  return { items }
})
