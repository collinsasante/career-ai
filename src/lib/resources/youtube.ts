/**
 * YouTube Data API v3 helper.
 *
 * Requires YOUTUBE_API_KEY environment variable.
 * Free quota: 10,000 units/day. Each search = 100 units.
 *
 * Roadmaps are cached in Airtable after first generation,
 * so YouTube is only called once per (user × career) pair.
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  url: string;
  thumbnailUrl?: string;
}

/**
 * Search YouTube for the best educational video matching `query`.
 * Returns null if no API key is set or the request fails.
 */
export async function searchYouTubeVideo(query: string): Promise<YouTubeVideo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  try {
    const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
    endpoint.searchParams.set("part", "snippet");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("type", "video");
    endpoint.searchParams.set("videoEmbeddable", "true");
    endpoint.searchParams.set("relevanceLanguage", "en");
    endpoint.searchParams.set("maxResults", "1");
    endpoint.searchParams.set("key", apiKey);

    const res = await fetch(endpoint.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.warn("[YouTube API] Request failed:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json() as {
      items?: Array<{
        id: { videoId: string };
        snippet: { title: string; channelTitle: string; thumbnails?: { default?: { url: string } } };
      }>;
    };

    const item = data.items?.[0];
    if (!item) return null;

    return {
      videoId:      item.id.videoId,
      title:        item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      url:          `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnailUrl: item.snippet.thumbnails?.default?.url,
    };
  } catch (err) {
    console.warn("[YouTube API] Error:", err);
    return null;
  }
}

/** YouTube search results page URL — used as a last fallback. */
export function youTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
