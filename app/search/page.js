'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
//import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 40;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(
            query
          )}&page=${currentPage}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error('검색 실패');
        }

        const data = await response.json();
        console.log('Search API Response:', data);

        if (data.success) {
          setProducts(data.data.products);
          setTotalCount(data.data.totalCount);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  if (loading) return <Loading />;

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

      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.uid} product={product} />
        ))}
      </div> */}

      {/* 페이지네이션 */}
      {totalCount > limit && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(totalCount / limit) }).map(
              (_, index) => (
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
              )
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
