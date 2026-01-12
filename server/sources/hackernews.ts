import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async (page) => {
  const baseURL = "https://news.ycombinator.com"
  const p = page || 1
  const url = p === 1 ? baseURL : `${baseURL}/news?p=${p}`
  const html: any = await myFetch(url)
  const $ = cheerio.load(html)
  const $main = $(".athing")
  const news: NewsItem[] = []
  $main.each((_, el) => {
    const a = $(el).find(".titleline a").first()
    // const url = a.attr("href")
    const title = a.text()
    const id = $(el).attr("id")
    const score = $(`#score_${id}`).text()
    const url = `${baseURL}/item?id=${id}`
    if (url && id && title) {
      news.push({
        url,
        title,
        id,
        extra: {
          info: score,
        },
      })
    }
  })
  return { items: news }
})
