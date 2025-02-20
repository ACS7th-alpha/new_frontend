'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

// SearchContent 컴포넌트로 useSearchParams를 사용하는 부분을 분리
function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // 총 건수 상태 추가
  const [page, setPage] = useState(1);
  const limit = 40;

  useEffect(() => {
    async function fetchSearchResults() {
      console.log('[SearchContent] Fetching search results:', {
        keyword,
        url: `/api/products?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=${limit}`,
        timestamp: new Date().toISOString(),
      });

      setLoading(true);
      try {
        const url =
          keyword === '전체'
            ? `/api/products?random=${Math.random()}`
            : `/api/products?keyword=${encodeURIComponent(
                keyword
              )}&page=${page}&limit=${limit}`;

        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-store',
          },
        });
        console.log('[SearchContent] Response status:', response.status);

        const data = await response.json();
        console.log('[SearchContent] Search response:', {
          success: data.success,
          productCount: data.data?.length || 0,
          meta: data.meta,
          fullResponse: data,
        });

        if (data.success) {
          setProducts(Array.isArray(data.data) ? data.data : []);
          setTotalPages(Math.ceil(data.total / limit)); // Calculate total pages
          setTotalCount(data.total || 0); // 총 건수 설정
          console.log('[SearchContent] Products updated:', {
            count: data.data.length,
            firstProduct: data.data[0],
            lastProduct: data.data[data.data.length - 1],
          });
        } else {
          console.error('[SearchContent] API Error:', data.error);
          setProducts([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error('[SearchContent] Failed to fetch search results:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
        console.log('[SearchContent] Loading state updated:', false);
      }
    }

    if (keyword) {
      console.log('[SearchContent] Keyword detected, initiating search');
      fetchSearchResults();
    } else {
      console.log('[SearchContent] No keyword provided, skipping search');
      setProducts([]);
      setLoading(false);
    }
  }, [keyword, page]);

  console.log('[SearchContent] Current state:', {
    productCount: products.length,
    isLoading: loading,
    hasKeyword: Boolean(keyword),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b flex justify-center items-center">
        <div className="animate-bounce text-4xl">🔍</div>
      </div>
    );
  }

  const getPageRange = () => {
    const startPage = Math.floor((page - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
    return { startPage, endPage };
  };

  const { startPage, endPage } = getPageRange();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-12">
        {/* 검색 결과 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            &ldquo;{keyword}&rdquo; 검색 결과
          </h1>
          <p className="text-xl text-gray-600">
            총{' '}
            <span className="text-xl font-bold text-orange-500">
              {totalCount}
            </span>
            건의 상품이 있습니다
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">검색 결과가 없습니다 😢</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product.uid}
                  href={`/product/${product.uid}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 block"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="px-5 py-4">
                    <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                      {product.name}
                    </h2>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {product.site}
                      </p>
                      <p className="text-xl font-bold text-black">
                        {product.sale_price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length > 0 && (
              <div className="flex justify-center items-center gap-1 mt-12">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-3 rounded-full bg-white text-gray-700 border-2 border-pink-200 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  ← 이전
                </button>

                {/* 페이지 번호 목록 */}
                <div className="flex gap-1">
                  {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, idx) => startPage + idx
                  ).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`rounded-full text-pink-600 font-medium ${
                        page === n ? 'bg-pink-100' : 'bg-white hover:bg-pink-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* "Next" arrow for the next set of pages */}
                {endPage < totalPages && (
                  <button
                    onClick={() => setPage(endPage + 1)}
                    className="px-6 py-3 rounded-full bg-white text-gray-700 border-2 border-pink-200 hover:bg-pink-50 transition-colors duration-200 font-medium"
                  >
                    → 다음
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  console.log('[SearchPage] Rendering with params:', {
    keyword,
    timestamp: new Date().toISOString(),
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      console.log('[SearchPage] Fetching search results:', {
        keyword,
        url: `/api/search?keyword=${encodeURIComponent(
          keyword
        )}&page=1&limit=40`,
        timestamp: new Date().toISOString(),
      });

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?keyword=${encodeURIComponent(keyword)}&page=1&limit=40`
        );
        console.log('[SearchPage] Response status:', response.status);

        const data = await response.json();
        console.log('[SearchPage] Search response:', {
          success: data.success,
          productCount: data.data?.length || 0,
          meta: data.meta,
          fullResponse: data,
        });

        if (data.success) {
          setProducts(data.data);
          console.log('[SearchPage] Products updated:', {
            count: data.data.length,
            firstProduct: data.data[0],
            lastProduct: data.data[data.data.length - 1],
          });
        } else {
          console.error('[SearchPage] API Error:', data.error);
          setProducts([]);
        }
      } catch (error) {
        console.error('[SearchPage] Failed to fetch search results:', error);
        setProducts([]);
      } finally {
        setLoading(false);
        console.log('[SearchPage] Loading state updated:', false);
      }
    }

    if (keyword) {
      console.log('[SearchPage] Keyword detected, initiating search');
      fetchSearchResults();
    } else {
      console.log('[SearchPage] No keyword provided, skipping search');
      setProducts([]);
      setLoading(false);
    }
  }, [keyword]);

  console.log('[SearchPage] Current state:', {
    productCount: products.length,
    isLoading: loading,
    hasKeyword: Boolean(keyword),
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
