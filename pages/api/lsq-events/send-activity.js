export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // In a real integration, forward this to LeadSquared with credentials.
  // For now, accept and log.
  const { activity_name, account_name, fields } = req.body || {};
  console.log('[LSQ Activity]', { activity_name, account_name, fields });
  return res.status(200).json({ ok: true });
}


