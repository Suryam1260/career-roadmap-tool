/**
 * DOM utility functions
 */

/**
 * Add or update a meta tag in the document head
 * @param {string} name - The name attribute of the meta tag
 * @param {string} content - The content value to set
 */
export function addMeta(name, content) {
  if (typeof document === 'undefined') return;
  
  let meta = document.querySelector(`meta[name="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

/**
 * Get meta tag content by name
 * @param {string} name - The name attribute of the meta tag
 * @returns {string|null} The content value or null if not found
 */
export function getMeta(name) {
  if (typeof document === 'undefined') return null;
  
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta?.content || null;
}

