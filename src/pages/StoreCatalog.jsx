import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ProductService } from '../services/api';
import { categoryPath, productPath, searchPath } from '../utils/storeRoutes';
import { useAuth } from '../contexts/AuthContext';
import { getLocalizedProduct, useLanguage } from '../contexts/LanguageContext';

const PAGE_SIZE = 16;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const localizedProduct = getLocalizedProduct(product, language);
  const image = product.images?.[0]?.url || product.images?.[0] || product.image;
  const canSeeWholesale = user?.retailerStatus === 'approved';
  const hasWholesalePrice = canSeeWholesale && product.wholesalePrice !== undefined && product.wholesalePrice !== null;
  const mrp = Number(product.mrp ?? product.originalPrice ?? product.price ?? 0);
  const price = Number(hasWholesalePrice ? product.wholesalePrice : mrp);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={productPath(product)} className="block bg-slate-50">
        <img
          src={image}
          alt={localizedProduct.name || localizedProduct.title || t('Spare part')}
          className="h-52 w-full object-contain p-4"
          loading="lazy"
        />
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {product.brand || t(product.category || 'Bike parts')}
        </p>
        <Link to={productPath(product)} className="block font-semibold text-slate-900 hover:text-blue-700">
          {localizedProduct.name || localizedProduct.title}
        </Link>
        <div className="flex items-center justify-between gap-3">
          <div>
            <strong className="text-lg text-slate-900">₹{price.toLocaleString('en-IN')}</strong>
            {hasWholesalePrice ? (
              <span className="block text-xs text-blue-700">{t('Wholesale price')}</span>
            ) : mrp > price ? (
              <span className="ml-2 text-xs text-slate-500 line-through">₹{mrp.toLocaleString('en-IN')} {t('MRP')}</span>
            ) : (
              <span className="block text-xs text-slate-500">{t('MRP')}</span>
            )}
          </div>
          <span className={product.inStock === false ? 'text-xs text-red-600' : 'text-xs text-green-700'}>
            {product.inStock === false || Number(product.stock) <= 0 ? t('Out of stock') : t(product.stockStatus || 'Available')}
          </span>
        </div>
      </div>
    </article>
  );
};

function StoreCatalog({ mode }) {
  const { t } = useLanguage();
  const { slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q')?.trim() || '';
  const isAllParts = mode === 'category' && slug === 'all';
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState(mode === 'search' ? 'Search results' : isAllParts ? 'All parts' : '');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(mode === 'category' || Boolean(query));
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'search' && !query) return undefined;

    let active = true;
    const request = mode === 'search'
      ? ProductService.getAll({ search: query, page, limit: PAGE_SIZE })
      : isAllParts
        ? ProductService.getAll({ page, limit: PAGE_SIZE })
        : ProductService.getByCategory(slug, { page, limit: PAGE_SIZE });

    request.then((response) => {
      if (!active) return;

      const payload = response.data?.data;
      const categoryData = mode === 'category' && !isAllParts ? payload?.category : null;
      const productList = mode === 'category' && !isAllParts
        ? payload?.products
        : Array.isArray(payload)
          ? payload
          : payload?.products;
      const pagination = mode === 'category' && !isAllParts
        ? payload?.meta?.pagination
        : response.data?.meta?.pagination;

      setTitle(categoryData?.name || (isAllParts ? 'All parts' : 'Search results'));
      setProducts(Array.isArray(productList) ? productList : []);
      setTotal(pagination?.total || 0);
      setPageCount(Math.max(1, pagination?.pages || 1));
      setError('');
    }).catch((requestError) => {
      if (!active) return;
      setProducts([]);
      setTotal(0);
      setPageCount(1);
      setError(requestError.message || 'Unable to load products right now.');
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [isAllParts, mode, page, query, slug]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(searchPath(searchInput));
  };

  const pageHeading = mode === 'search'
    ? query ? `Search results for “${query}”` : 'Search spare parts'
    : title;

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-700">{t('Home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{t(mode === 'search' ? 'Search' : 'Parts')}</span>
      </nav>

      {mode === 'search' && (
        <form onSubmit={submitSearch} role="search" className="mb-8 flex gap-2">
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('Search parts, brands or bike model...')}
            aria-label={t('Search spare parts')}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <button type="submit" className="rounded-lg bg-blue-800 px-5 py-3 font-semibold text-white hover:bg-blue-900">
            {t('Search')}
          </button>
        </form>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {mode === 'search' && query ? `${t('Search results for')} “${query}”` : t(pageHeading || 'Parts')}
          </h1>
          {!loading && !error && <p className="mt-1 text-sm text-slate-500">{total} {t('products')}</p>}
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-slate-600" role="status">{t('Loading products…')}</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
          {error}
        </div>
      ) : mode === 'search' && !query ? (
        <div className="rounded-xl bg-slate-50 px-6 py-14 text-center text-slate-600">
          {t('Enter a part name, brand, or bike model to search.')}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {mode === 'search' ? `${t('No products found for')} “${query}”` : t('No products found')}
          </h2>
          <p className="mt-2 text-slate-600">{t('Try another search or browse all parts.')}</p>
          <Link to={categoryPath('all')} className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
            {t('Browse all parts')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => { setLoading(true); setPage((current) => current - 1); }}
                className="rounded-md border border-slate-300 px-4 py-2 disabled:opacity-50"
              >
                {t('Previous')}
              </button>
              <span className="text-sm text-slate-600">{t('Page')} {page} {t('of')} {pageCount}</span>
              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => { setLoading(true); setPage((current) => current + 1); }}
                className="rounded-md border border-slate-300 px-4 py-2 disabled:opacity-50"
              >
                {t('Next')}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default StoreCatalog;
