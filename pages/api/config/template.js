/**
 * TEMPLATE LOADER API
 *
 * Serves modular persona config templates from the server
 *
 * GET /api/config/template?path=roles/backend.json
 *
 * Returns: JSON config file or 404 if not found
 */

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path: templatePath } = req.query;

    if (!templatePath) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Security: Prevent directory traversal
    if (templatePath.includes('..') || templatePath.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    // Build full file path - configs are in src/configs/personas
    const fullPath = path.join(
      process.cwd(),
      'src',
      'configs',
      'personas',
      templatePath
    );

    // Verify the file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        error: `Template not found: ${templatePath}`,
        requestedPath: templatePath,
        fullPath: fullPath
      });
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // Return with proper cache headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    return res.status(200).json(jsonData);

  } catch (error) {
    console.error('Error loading template:', error);

    // Distinguish between different error types
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: 'Invalid JSON in template file',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Failed to load template',
      message: error.message
    });
  }
}
