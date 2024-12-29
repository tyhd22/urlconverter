'use server'

export async function checkUrls(urls: string[]) {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        
        if (!response.ok) {
          return {
            url,
            title: null,
            status: response.status,
            error: `HTTP error! status: ${response.status}`
          }
        }

        const html = await response.text()
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/)
        const title = titleMatch ? titleMatch[1].trim() : '无标题'

        return {
          url,
          title,
          status: response.status,
          error: null
        }
      } catch (error) {
        return {
          url,
          title: null,
          status: 0,
          error: '无法访问此网站'
        }
      }
    })
  )
  return results
}

