export const slugify = (value = '') =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const searchPath = (query) => {
  const value = query?.trim();
  return value ? `/search?q=${encodeURIComponent(value)}` : '/search';
};

export const categoryPath = (slug) => `/category/${encodeURIComponent(slug || 'all')}`;

export const productPath = (product) => {
  const id = product?._id || product?.id;
  if (!id) return searchPath(product?.name || product?.title || '');

  const productSlug = slugify(product.name || product.title || 'product');
  return `/product/${productSlug}-${id}`;
};
