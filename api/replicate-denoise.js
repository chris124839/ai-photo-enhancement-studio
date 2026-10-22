// Vercel serverless endpoint. Keep REPLICATE_API_TOKEN in Vercel Environment Variables.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!process.env.REPLICATE_API_TOKEN) return res.status(503).json({ error: 'AI processing is not configured. Add REPLICATE_API_TOKEN in Vercel project settings.' });
  const { image, noise = 15 } = req.body || {};
  if (typeof image !== 'string' || !image.startsWith('data:image/')) return res.status(400).json({ error: 'A valid image is required.' });
  if (image.length > 5_500_000) return res.status(413).json({ error: 'Image is too large for this endpoint (limit approximately 4 MB).' });
  const safeNoise = [5, 15, 25].includes(Number(noise)) ? Number(noise) : 15;
  try {
    const create = await fetch('https://api.replicate.com/v1/models/jingyunliang/swinir/predictions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.REPLICATE_API_TOKEN, 'Content-Type': 'application/json', Prefer: 'wait=60' },
      body: JSON.stringify({ input: { image, task_type: 'Color Image Denoising', noise: safeNoise, jpeg: '40' } })
    });
    const prediction = await create.json();
    if (!create.ok) return res.status(create.status).json({ error: prediction.detail || prediction.title || 'Replicate rejected the request.' });
    let current = prediction;
    for (let i = 0; i < 40 && current.status !== 'succeeded' && current.status !== 'failed' && current.status !== 'canceled'; i++) {
      if (!current.urls?.get) break;
      await new Promise(resolve => setTimeout(resolve, 1500));
      const poll = await fetch(current.urls.get, { headers: { Authorization: 'Bearer ' + process.env.REPLICATE_API_TOKEN } });
      current = await poll.json();
    }
    if (current.status !== 'succeeded') return res.status(502).json({ error: current.error || 'The AI model did not finish in time. Please try again.' });
    const output = Array.isArray(current.output) ? current.output[0] : current.output;
    const url = typeof output === 'string' ? output : output?.url;
    if (!url) return res.status(502).json({ error: 'Replicate returned no output image.' });
    return res.status(200).json({ output: url, model: 'jingyunliang/swinir', task: 'Color Image Denoising' });
  } catch (error) {
    return res.status(500).json({ error: 'AI processing failed. Check the Vercel function logs.' });
  }
}
