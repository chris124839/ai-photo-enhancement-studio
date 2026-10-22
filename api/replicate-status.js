// Check a Replicate prediction without exposing the API token to the browser.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });
  if (!process.env.REPLICATE_API_TOKEN) return res.status(503).json({ error: 'AI processing is not configured. Add REPLICATE_API_TOKEN in Vercel project settings.' });
  const id = typeof req.query?.id === 'string' ? req.query.id : '';
  if (!/^[a-z0-9]{8,64}$/i.test(id)) return res.status(400).json({ error: 'Invalid prediction ID.' });
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions/' + encodeURIComponent(id), { headers: { Authorization: 'Bearer ' + process.env.REPLICATE_API_TOKEN } });
    const prediction = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: prediction.detail || prediction.title || 'Could not retrieve prediction status.' });
    if (prediction.status === 'succeeded') {
      const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      const url = typeof output === 'string' ? output : output?.url;
      if (!url || !/^https:\/\//i.test(url)) return res.status(502).json({ error: 'Replicate returned no valid output image.' });
      return res.status(200).json({ id, status: 'succeeded', output: url });
    }
    if (prediction.status === 'failed' || prediction.status === 'canceled') return res.status(200).json({ id, status: prediction.status, error: prediction.error || 'AI processing did not complete.' });
    return res.status(200).json({ id, status: prediction.status || 'processing' });
  } catch {
    return res.status(502).json({ error: 'Could not check AI processing status.' });
  }
}
