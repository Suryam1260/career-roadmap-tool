/**
 * Build a URL to a public asset, honoring Next.js basePath in all environments.
 * Accepts a relative path starting with '/' (e.g., '/personas/complete/file.json').
 */
export function getPublicAssetPath(relativePath) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Ensure exactly one slash between base and relative
  if (!relativePath) return base || '/';
  if (base.endsWith('/') && relativePath.startsWith('/')) {
    return `${base.slice(0, -1)}${relativePath}`;
  }
  if (!base.endsWith('/') && !relativePath.startsWith('/')) {
    return `${base}/${relativePath}`;
  }
  return `${base}${relativePath}`;
}

export default getPublicAssetPath;


