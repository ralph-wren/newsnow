import { myFetch } from "#/utils/fetch"
import { defineSource } from "#/utils/source"

export default defineSource(async () => {
  const html = await myFetch("https://www.gamersky.com/")
  if (!html) return []

  // Simple regex parsing for the hot list
  // Looking for <li class="Mid0New-GameItem ...">
  const items: any[] = []

  // Match the block containing popular games
  const blockRegex = /<ul class="Mid0New-Game"(.*?)<\/ul>/s
  const blockMatch = html.match(blockRegex)

  if (blockMatch) {
    const block = blockMatch[0]
    const itemRegex = /<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g
    const matches = block.matchAll(itemRegex)
    for (const match of matches) {
      if (match[2] && !match[2].includes("<img")) {
        items.push({
          url: match[1],
          title: match[2],
        })
      }
    }
  }

  return items.map(item => ({
    id: item.url,
    title: item.title,
    url: item.url,
  }))
})
