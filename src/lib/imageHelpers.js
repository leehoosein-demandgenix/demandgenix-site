/**
 * Optimize Sanity images with URL parameters
 */
export function optimizeSanityImage(url, options = {}) {
  if (!url) return '';
  
  const {
    width = 800,
    height = null,
    fit = 'max',
    format = 'webp',
    quality = 80
  } = options;
  
  const params = new URLSearchParams();
  params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('fit', fit);
  params.append('fm', format);
  params.append('q', quality.toString());
  
  return `${url}?${params.toString()}`;
}