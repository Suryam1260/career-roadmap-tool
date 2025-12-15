export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // In a real integration, this would persist attribution to your backend/DB.
  // For now, accept and echo payload.
  const { attributions, owner } = req.body || {};
  console.log('[Attributions]', { attributions, owner });
  return res.status(200).json({ ok: true });
}


