export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, note, source, tags, metadata } = req.body || {};

    // Basic validation: require at least one contact method
    if (!email && !phone) {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    // Build normalized payload
    const normalized = {
      name: typeof name === 'string' ? name.trim() : '',
      email: typeof email === 'string' ? email.trim() : '',
      phone: typeof phone === 'string' ? phone.trim() : '',
      note: typeof note === 'string' ? note.trim() : '',
      source: typeof source === 'string' ? source : '',
      tags: Array.isArray(tags) ? tags : [],
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : {}
    };

    // This is where you'd forward to your CRM/Slack/Email service.
    // For now, we log and return success.
    // eslint-disable-next-line no-console
    console.log('[request-callback] Received:', normalized);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}


