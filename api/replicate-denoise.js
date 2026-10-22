// Create Replicate predictions without waiting inside a short-lived serverless function.
const MODEL_VERSION = 'replicatemodel/swinir_t4:6f3a0035cfa43e83811421021d3360750250d6f527fa06f306d870721edc4447';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!process.env.REPLICATE_API_TOKEN) return res.status(503).json({ error: 'AI processing is not configured. Add REPLICATE_API_TOKEN in Vercel project settings.' });
  const { image, noise = 15, operation = 'denoise' } = req.body || {};
  if (typeof image !== 'string' || !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image)) return res.status(400).json({ error: 'A valid JPEG, PNG, or WEBP image is required.' });
  if (image.length > 5_500_000) return res.status(413).json({ error: 'Image is too large for this endpoint (limit approximately 4 MB).' });
  if (!['denoise', 'upscale'].includes(operation)) return res.status(400).json({ error: 'Unsupported AI operation.' });
  const task_type = operation === 'upscale' ? 'Real-World Image Super-Resolution-Large' : 'Color Image Denoising';
  const safeNoise = [5, 15, 25].includes(Number(noise)) ? Number(noise) : 15;
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.REPLICATE_API_TOKEN, 'Content-Type': 'application/json', Prefer: 'wait=0' },
      body: JSON.stringify({ version: MODEL_VERSION, input: { image, task_type, noise: safeNoise, jpeg: 40, out_format: 'png', out_jpg_quality: 95 } })
    });
    const prediction = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: prediction.detail || prediction.title || prediction.error || 'Replicate rejected the request.' });
    if (!prediction.id) return res.status(502).json({ error: 'Replicate did not return a prediction ID.' });
    return res.status(202).json({ id: prediction.id, status: prediction.status || 'starting', task_type });
  } catch {
    return res.status(502).json({ error: 'Could not reach Replicate. Please try again.' });
  }
}
