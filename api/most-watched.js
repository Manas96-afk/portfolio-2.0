/**
 * Server-side API Route / Serverless Function for Vercel and local Vite middleware
 * Endpoint: /api/most-watched
 *
 * Securely communicates with YouTube Data API v3.
 * Caches top 4 most-viewed videos for 1 hour in-memory & via Cache-Control headers.
 * NEVER exposes the API key or raw errors to the client.
 */

let memoryCache = {
  timestamp: 0,
  data: null,
}

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export function formatViews(num) {
  if (!num || isNaN(num)) return '0 VIEWS'
  const n = Number(num)
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M VIEWS'
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K VIEWS'
  }
  return n.toLocaleString() + ' VIEWS'
}

export function formatSubscribers(num) {
  if (!num || isNaN(num)) return '0'
  const n = Number(num)
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return n.toLocaleString()
}

export const FALLBACK_VIDEOS = [
  {
    id: '4iaZf9-LTuQ',
    title: 'The Greatest of All Time Cars (G.O.A.T. Cars)',
    thumbnail: 'https://i.ytimg.com/vi/4iaZf9-LTuQ/maxresdefault.jpg',
    viewCount: 22380,
    formattedViews: '22.4K VIEWS',
    watchUrl: 'https://www.youtube.com/watch?v=4iaZf9-LTuQ',
    publishedAt: '2025-07-29T04:30:03Z',
  },
  {
    id: '3xxPzTvSlMs',
    title: 'I Cooked a MacBook Using Only Windows Software',
    thumbnail: 'https://i.ytimg.com/vi/3xxPzTvSlMs/maxresdefault.jpg',
    viewCount: 6971,
    formattedViews: '7K VIEWS',
    watchUrl: 'https://www.youtube.com/watch?v=3xxPzTvSlMs',
    publishedAt: '2025-11-01T06:30:02Z',
  },
  {
    id: 'TmAw6PIbkLc',
    title: 'The Pink Kitty BMW - A Black Edition',
    thumbnail: 'https://i.ytimg.com/vi/TmAw6PIbkLc/maxresdefault.jpg',
    viewCount: 5162,
    formattedViews: '5.2K VIEWS',
    watchUrl: 'https://www.youtube.com/watch?v=TmAw6PIbkLc',
    publishedAt: '2025-07-10T07:30:22Z',
  },
  {
    id: 'rZZEE88Nl-s',
    title: 'say the word on beat challenge',
    thumbnail: 'https://i.ytimg.com/vi/rZZEE88Nl-s/maxresdefault.jpg',
    viewCount: 4423,
    formattedViews: '4.4K VIEWS',
    watchUrl: 'https://www.youtube.com/watch?v=rZZEE88Nl-s',
    publishedAt: '2026-01-07T09:30:36Z',
  },
]

export const FALLBACK_CHANNEL_STATS = {
  title: 'cnomo editz',
  handle: '@cnomo_editz',
  subscriberCount: 186,
  formattedSubscribers: '186',
  totalViews: 110825,
  formattedTotalViews: '110.8K VIEWS',
  videoCount: 79,
  avatar: 'https://yt3.ggpht.com/xmBZgt2FAtRfaVShVldBHbBwvRq0iVzYve0rrlSkQxaVFc1EXf9RVNow7ptJHPtDqwfbRHiNHQ=s240-c-k-c0x00ffffff-no-rj',
  channelUrl: 'https://www.youtube.com/@cnomo_editz',
}

export async function getMostWatchedVideos(apiKey, handle = 'cnomo_editz', channelId = null) {
  if (!apiKey) {
    return {
      configured: false,
      videos: FALLBACK_VIDEOS,
      channelStats: FALLBACK_CHANNEL_STATS,
      message: 'Serving verified cache; add YOUTUBE_API_KEY for dynamic hourly live telemetry.',
    }
  }

  const now = Date.now()
  if (memoryCache.data && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return {
      configured: true,
      cached: true,
      videos: memoryCache.data.videos,
      channelStats: memoryCache.data.channelStats,
    }
  }

  const cleanHandle = handle ? handle.replace(/^@/, '') : 'cnomo_editz'
  let resolvedChannelId = channelId || null
  let uploadsPlaylistId = null
  let channelStats = null

  // 1. Resolve channel ID, uploads playlist, and live statistics
  if (resolvedChannelId) {
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(resolvedChannelId)}&key=${apiKey}`
    )
    const chData = await chRes.json()
    if (chData.items && chData.items.length > 0) {
      const item = chData.items[0]
      uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads
      const subCount = Number(item.statistics?.subscriberCount || 0)
      const viewCount = Number(item.statistics?.viewCount || 0)
      const vidCount = Number(item.statistics?.videoCount || 0)
      channelStats = {
        title: item.snippet?.title || 'cnomo editz',
        handle: `@${cleanHandle}`,
        subscriberCount: subCount,
        formattedSubscribers: formatSubscribers(subCount),
        totalViews: viewCount,
        formattedTotalViews: formatViews(viewCount),
        videoCount: vidCount,
        avatar: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
        channelUrl: `https://www.youtube.com/@${cleanHandle}`,
      }
    }
  } else {
    // Try forHandle parameter
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id,snippet,contentDetails,statistics&forHandle=${encodeURIComponent(cleanHandle)}&key=${apiKey}`
    )
    const chData = await chRes.json()
    if (chData.items && chData.items.length > 0) {
      const item = chData.items[0]
      resolvedChannelId = item.id
      uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads
      const subCount = Number(item.statistics?.subscriberCount || 0)
      const viewCount = Number(item.statistics?.viewCount || 0)
      const vidCount = Number(item.statistics?.videoCount || 0)
      channelStats = {
        title: item.snippet?.title || 'cnomo editz',
        handle: `@${cleanHandle}`,
        subscriberCount: subCount,
        formattedSubscribers: formatSubscribers(subCount),
        totalViews: viewCount,
        formattedTotalViews: formatViews(viewCount),
        videoCount: vidCount,
        avatar: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
        channelUrl: `https://www.youtube.com/@${cleanHandle}`,
      }
    }
  }

  // Fallback: search channel by query if forHandle didn't resolve
  if (!resolvedChannelId) {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(cleanHandle)}&key=${apiKey}`
    )
    const searchData = await searchRes.json()
    if (searchData.items && searchData.items.length > 0) {
      resolvedChannelId = searchData.items[0].snippet?.channelId
      if (resolvedChannelId) {
        const chRes2 = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(resolvedChannelId)}&key=${apiKey}`
        )
        const chData2 = await chRes2.json()
        if (chData2.items && chData2.items.length > 0) {
          const item = chData2.items[0]
          uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads
          const subCount = Number(item.statistics?.subscriberCount || 0)
          const viewCount = Number(item.statistics?.viewCount || 0)
          const vidCount = Number(item.statistics?.videoCount || 0)
          channelStats = {
            title: item.snippet?.title || 'cnomo editz',
            handle: `@${cleanHandle}`,
            subscriberCount: subCount,
            formattedSubscribers: formatSubscribers(subCount),
            totalViews: viewCount,
            formattedTotalViews: formatViews(viewCount),
            videoCount: vidCount,
            avatar: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
            channelUrl: `https://www.youtube.com/@${cleanHandle}`,
          }
        }
      }
    }
  }

  // 2. Pool video IDs from both search(order=viewCount) and uploads playlist
  const videoIdSet = new Set()

  const fetchPromises = []

  if (resolvedChannelId) {
    fetchPromises.push(
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(resolvedChannelId)}&order=viewCount&type=video&maxResults=50&key=${apiKey}`
      )
        .then((r) => r.json())
        .then((d) => {
          ;(d.items || []).forEach((item) => {
            if (item.id?.videoId) videoIdSet.add(item.id.videoId)
          })
        })
        .catch(() => {})
    )
  }

  if (uploadsPlaylistId) {
    fetchPromises.push(
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=50&key=${apiKey}`
      )
        .then((r) => r.json())
        .then((d) => {
          ;(d.items || []).forEach((item) => {
            if (item.contentDetails?.videoId) videoIdSet.add(item.contentDetails.videoId)
          })
        })
        .catch(() => {})
    )
  }

  await Promise.all(fetchPromises)

  const allIds = Array.from(videoIdSet)
  if (allIds.length === 0) {
    return { configured: true, videos: [] }
  }

  // 3. Fetch exact statistics in batches of 50
  let allVideoItems = []
  for (let i = 0; i < allIds.length; i += 50) {
    const chunk = allIds.slice(i, i + 50)
    const vidRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(chunk.join(','))}&key=${apiKey}`
    )
    const vidData = await vidRes.json()
    if (vidData.items && vidData.items.length > 0) {
      allVideoItems = allVideoItems.concat(vidData.items)
    }
  }

  if (allVideoItems.length === 0) {
    return { configured: true, videos: [] }
  }

  // 4. Sort by viewCount descending and take top 4
  const sorted = allVideoItems
    .map((vid) => {
      const viewCount = parseInt(vid.statistics?.viewCount || '0', 10)
      const thumbs = vid.snippet?.thumbnails || {}
      const thumbnail = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || ''
      return {
        id: vid.id,
        title: vid.snippet?.title || 'Untitled Video',
        thumbnail,
        viewCount,
        formattedViews: formatViews(viewCount),
        watchUrl: `https://www.youtube.com/watch?v=${vid.id}`,
        publishedAt: vid.snippet?.publishedAt || '',
      }
    })
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 4)

  memoryCache = {
    timestamp: now,
    data: {
      videos: sorted,
      channelStats,
    },
  }

  return {
    configured: true,
    cached: false,
    videos: sorted,
    channelStats,
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800')

  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    const handle = process.env.YOUTUBE_CHANNEL_HANDLE || 'cnomo_editz'
    const channelId = process.env.YOUTUBE_CHANNEL_ID

    const result = await getMostWatchedVideos(apiKey, handle, channelId)
    return res.status(200).json(result)
  } catch {
    // Return sanitized fallback; never leak keys or internal errors
    return res.status(200).json({
      configured: true,
      videos: FALLBACK_VIDEOS,
      channelStats: FALLBACK_CHANNEL_STATS,
      fallback: true,
      message: 'Serving fallback video archive',
    })
  }
}
