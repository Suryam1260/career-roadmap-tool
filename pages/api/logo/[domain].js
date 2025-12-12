/**
 * Next.js API Route - Logo Proxy
 * Proxies Clearbit logo requests server-side to bypass CORS
 */

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter required' });
  }

  try {
    // Fetch logo from Clearbit server-side (no CORS issues)
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    const response = await fetch(logoUrl);

    if (!response.ok) {
      // Return 404 or error status
      return res.status(response.status).end();
    }

    // Get image buffer
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Send the image
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Logo proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch logo' });
  }
}
