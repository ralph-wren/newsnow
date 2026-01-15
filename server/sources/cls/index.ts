import { getSearchParams } from "./utils"

interface Item {
  id: number
  title?: string
  brief: string
  shareurl: string
  // need *1000
  ctime: number
  // 1
  is_ad: number
}
interface TelegraphRes {
  data: {
    roll_data: Item[]
  }
}

interface Depthes {
  data: {
    top_article: Item[]
    depth_list: Item[]
  }
}

interface Hot {
  data: Item[]
}

const depth = defineSource(async (page, size) => {
  const limit = size || 30
  const p = page || 1
  const apiUrl = `https://www.cls.cn/v3/depth/home/assembled/${p * limit}`
  const res: Depthes = await myFetch(apiUrl, {
    query: Object.fromEntries(await getSearchParams()),
  })
  const items = res.data.depth_list.sort((m, n) => n.ctime - m.ctime).slice((p - 1) * limit, p * limit).map((k) => {
    return {
      id: k.id,
      title: k.title || k.brief,
      mobileUrl: k.shareurl,
      pubDate: k.ctime * 1000,
      url: `https://www.cls.cn/detail/${k.id}`,
    }
  })
  return { items }
})

const hot = defineSource(async (page, size) => {
  const limit = size || 30
  const p = page || 1
  const apiUrl = `https://www.cls.cn/v2/article/hot/list`
  const res: Hot = await myFetch(apiUrl, {
    query: Object.fromEntries(await getSearchParams()),
  })
  const items = res.data.slice((p - 1) * limit, p * limit).map((k) => {
    return {
      id: k.id,
      title: k.title || k.brief,
      mobileUrl: k.shareurl,
      url: `https://www.cls.cn/detail/${k.id}`,
    }
  })
  return { items }
})

const telegraph = defineSource(async (page, size) => {
  const limit = size || 30
  const p = page || 1
  const apiUrl = `https://www.cls.cn/nodeapi/updateTelegraphList`
  const res: TelegraphRes = await myFetch(apiUrl, {
    query: Object.fromEntries(await getSearchParams()),
  })
  const items = res.data.roll_data.filter(k => !k.is_ad).slice((p - 1) * limit, p * limit).map((k) => {
    return {
      id: k.id,
      title: k.title || k.brief,
      mobileUrl: k.shareurl,
      pubDate: k.ctime * 1000,
      url: `https://www.cls.cn/detail/${k.id}`,
    }
  })
  return { items }
})

export default defineSource({
  "cls": telegraph,
  "cls-telegraph": telegraph,
  "cls-depth": depth,
  "cls-hot": hot,
})
