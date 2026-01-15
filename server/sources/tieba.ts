interface Res {
  data: {
    bang_topic: {
      topic_list: {
        topic_id: string
        topic_name: string
        create_time: number
        topic_url: string

      }[]
    }
  }
}

export default defineSource(async (page, size) => {
  const url = "https://tieba.baidu.com/hottopic/browse/topicList"
  const res: Res = await myFetch(url)

  const limit = size || 30
  const p = page || 1
  const start = (p - 1) * limit
  const end = p * limit

  const items = res.data.bang_topic.topic_list.slice(start, end)
    .map((k) => {
      return {
        id: k.topic_id,
        title: k.topic_name,
        url: k.topic_url,
      }
    })
  return { items }
})
