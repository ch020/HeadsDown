// Netlify Function: /.netlify/functions/generatePack
// Proxies to OpenRouter using your server-side key and returns a clean string[].

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(event),
      body: ''
    }
  }

  try {
    if (event.httpMethod !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, event)
    }

    const { topic, maxItems = 300 } = JSON.parse(event.body || '{}')
    if (!topic || typeof topic !== 'string') {
      return json({ error: 'Missing topic' }, 400, event)
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return json({ error: 'Server not configured: OPENROUTER_API_KEY missing' }, 500, event)
    }

    const siteUrl = process.env.SITE_URL || getOrigin(event) || 'https://example.com'
    const siteName = process.env.SITE_NAME || 'HeadsDown'

    const system = `You output ONLY a JSON array of distinct short phrases (no keys, no prose).
Rules:
- Topic: ${topic}
- Quantity: ${maxItems}
- Each item: 1-3 words, concrete and suitable for a "Heads Up" party game.
- No numbers, no punctuation wrappers, no duplicates, no explanations.`
    const user = `Generate items for the "${topic}" pack. Ensure wide variety and zero duplicates.`

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl, // optional but recommended by OpenRouter
        'X-Title': siteName
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.8
      })
    })

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '')
      return json({ error: `OpenRouter ${resp.status}: ${txt.slice(0,400)}` }, resp.status, event)
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content ?? '[]'

    // Try strict JSON parse first
    let items
    try {
      items = JSON.parse(content)
      if (!Array.isArray(items)) throw new Error('not array')
    } catch {
      // Fallback: recover items from lines/bullets
      items = String(content)
        .split('\n')
        .map(l => l.replace(/^[-*\d\.\)\s]+/, '').trim())
        .filter(Boolean)
    }

    // Clean/dedupe and keep it short
    const cleaned = Array.from(
      new Set(
        items
          .map(s => String(s).trim())
          .filter(s =>
            s &&
            s.length <= 30 &&
            !/["{}\[\]]/.test(s) &&
            !/^\d+/.test(s)
          )
      )
    ).slice(0, maxItems)

    if (cleaned.length < 80) {
      // give a friendly warning; still return whatever we got
      return json({ warning: 'Low item count from model; try again or tweak topic.', items: cleaned }, 200, event)
    }

    return json({ items: cleaned }, 200, event)
  } catch (err) {
    return json({ error: (err && err.message) || 'Unexpected error' }, 500, event)
  }
}

function corsHeaders(event) {
  const origin = getOrigin(event)
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}
function json(body, status = 200, event) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(event) },
    body: JSON.stringify(body)
  }
}
function getOrigin(event) {
  const h = event.headers || {}
  return h.origin || h.Origin || h.referer || h.Referer || ''
}
