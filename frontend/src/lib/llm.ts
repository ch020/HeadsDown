export async function generatePackWithLLM(topic: string, maxItems = 300): Promise<string[]> {
  const res = await fetch('/.netlify/functions/generatePack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic,
      maxItems
    })
  })

  if (!res.ok) {
    const txt = await res.text().catch(()=> '')
    throw new Error(`LLM proxy error: ${res.status} ${txt}`)
  }
  const data = await res.json()
  const items: string[] = data.items ?? []
  return items
}
