'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Loading from '../components/Loading';
import { unstable_noStore as noStore } from 'next/cache';

export default function SearchPage() {
  noStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 40;

  console.log('[SearchPage] Render start:', { query, currentPage, loading });

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        console.log('[SearchPage] No query provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log('[SearchPage] Fetching data:', { query, currentPage, limit });

      try {
        const apiUrl = `/api/search?keyword=${encodeURIComponent(
          query
        )}&page=${currentPage}&limit=${limit}`;
        console.log('[SearchPage] API URL:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('[SearchPage] Response status:', response.status);

        if (!response.ok) {
          throw new Error(`검색 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log('[SearchPage] Raw API response:', data);

        if (data.success) {
          console.log('[SearchPage] Setting data:', {
            productsCount: data.data?.length,
            total: data.meta?.total,
          });
          setProducts(data.data || []);
          const totalItems = data.meta?.total || 0;
          const calculatedTotalPages = Math.max(
            Math.ceil(totalItems / limit),
            1
          );
          setTotalPages(calculatedTotalPages);
          setTotalCount(totalItems);
        } else {
          console.warn('[SearchPage] API returned success: false');
        }
      } catch (error) {
        console.error('[SearchPage] Error:', error);
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
        console.log('[SearchPage] Loading finished');
      }
    };

    console.log('[SearchPage] Effect triggered');
    fetchSearchResults();
  }, [query, currentPage]);

  console.log('[SearchPage] Before render:', {
    loading,
    productsCount: products.length,
    totalCount,
    totalPages,
  });

  if (loading) {
    console.log('[SearchPage] Rendering loading state');
    return <Loading />;
  }

  if (!query) {
    console.log('[SearchPage] No query - rendering empty state');
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">검색어를 입력해주세요.</p>
      </div>
    );
  }

  if (products.length === 0) {
    console.log('[SearchPage] No results - rendering empty state');
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          &quot;{query}&quot; 검색 결과
        </h1>
        <p className="text-gray-600">
          총{' '}
          <span className="text-xl font-bold text-orange-500">
            {totalCount}
          </span>
          건의 상품이 있습니다
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.uid}
            onClick={() => router.push(`/product/${product.uid}`)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
          >
            <div className="relative pb-[100%]">
              <img
                src={product.img}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-black-500">
                {Number(product.sale_price).toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
