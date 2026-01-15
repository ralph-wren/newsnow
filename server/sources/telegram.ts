import { load } from "cheerio"
import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

export default defineSource(async () => {
  try {
    const channel = process.env.TELEGRAM_CHANNEL || "telegram"
    // Use t.me/s/ view for static preview
    const html = await myFetch<string>(`https://t.me/s/${channel}`)
    if (!html) return []

    const $ = load(html)
    const items: any[] = []

    $(".tgme_widget_message_wrap").each((_, el) => {
      const $el = $(el)
      const $text = $el.find(".tgme_widget_message_text")
      if ($text.length === 0) return

      const $msg = $el.find(".tgme_widget_message")
      const id = $msg.attr("data-post")
      const text = $text.text().trim()
      if (!text) return

      // Use first line or first 100 chars as title
      let title = text.split("\n")[0]
      if (title.length > 100) title = `${title.substring(0, 100)}...`

      const link = `https://t.me/${channel}/${id ? id.split("/")[1] : ""}`
      const time = $el.find(".tgme_widget_message_date time").attr("datetime")
      const views = $el.find(".tgme_widget_message_views").text().trim()

      items.push({
        id: id || link,
        title,
        url: link,
        extra: {
          info: views ? `👁 ${views}` : undefined,
          date: time,
        },
      })
    })

    // Return reversed to have newest first
    return items.reverse()
  } catch (e) {
    console.error("Telegram fetch failed", e)
    return []
  }
})
