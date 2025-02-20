'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/app/constants/categories';

export default function CategoryProduct() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('전체');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [childName, setChildName] = useState(null);
  const limit = 40;

  // 페이지 범위 계산
  const getPageRange = () => {
    const startPage = Math.floor((page - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
    console.log('[CategoryProduct] Page range calculated:', {
      currentPage: page,
      startPage,
      endPage,
      totalPages,
    });
    return { startPage, endPage };
  };

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem('userData');
      console.log('[CategoryProduct] Loading user data:', {
        hasUserData: !!userData,
        timestamp: new Date().toISOString(),
      });

      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserInfo(parsedData);
        const hasChildren = parsedData?.userInfo?.user?.children?.length > 0;
        const firstChildName = hasChildren
          ? parsedData.userInfo.user.children[0].name
          : undefined;

        console.log('[CategoryProduct] Parsed user data:', {
          userInfo: parsedData,
          hasChildren,
          firstChildName,
        });

        setChildName(firstChildName);
      }
    };

    loadUserData();
  }, []);

  // 상품 데이터 로드
  useEffect(() => {
    async function fetchProducts() {
      console.log('[CategoryProduct] Fetching products:', {
        category,
        page,
        limit,
        timestamp: new Date().toISOString(),
      });

      setLoading(true);
      try {
        let url = '/api/search/category';
        if (category !== '전체') {
          const encodedCategory = encodeURIComponent(category);
          url += `?category=${encodedCategory}&page=${page}&limit=${limit}`;
        } else {
          url += `?page=${page}&limit=${limit}`;
        }

        console.log('[CategoryProduct] Request URL:', url);

        // Authorization 헤더 추가
        const accessToken = localStorage.getItem('access_token');
        const headers = {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, { headers });

        console.log('[CategoryProduct] Raw Response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        const data = await response.json();
        console.log('[CategoryProduct] Raw API Response:', {
          ...data,
          requestedCategory: category,
          encodedUrl: url,
        });

        if (data.success) {
          setProducts(data.data);
          const total = data.meta.total;
          setTotalPages(Math.ceil(total / limit));

          console.log('[CategoryProduct] Products loaded:', {
            productsCount: data.data.length,
            totalProducts: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
          });
        } else {
          console.log('[CategoryProduct] No products found:', {
            category,
            headers,
            meta: data.meta,
          });
          setProducts([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('[CategoryProduct] Failed to fetch products:', {
          error: error.message,
          message: error.toString(),
        });
        setProducts([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, page]);

  // 상태 저장
  useEffect(() => {
    const saveState = () => {
      console.log('[CategoryProduct] Saving state:', {
        category,
        page,
        scrollY: window.scrollY,
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem(
        'categoryProductState',
        JSON.stringify({
          category,
          page,
          scrollPosition: window.scrollY,
        })
      );
    };

    window.addEventListener('beforeunload', saveState);
    return () => window.removeEventListener('beforeunload', saveState);
  }, [category, page]);

  // 저장된 상태 복원
  useEffect(() => {
    const savedState = sessionStorage.getItem('categoryProductState');
    console.log('[CategoryProduct] Restoring saved state:', {
      savedCategory: savedState ? JSON.parse(savedState).category : null,
      savedPage: savedState ? JSON.parse(savedState).page : null,
      savedScrollPosition: savedState
        ? JSON.parse(savedState).scrollPosition
        : null,
      timestamp: new Date().toISOString(),
    });

    if (savedState) {
      const {
        category: savedCategory,
        page: savedPage,
        scrollPosition,
      } = JSON.parse(savedState);
      setCategory(savedCategory);
      setPage(savedPage);
      window.scrollTo(0, scrollPosition);
      sessionStorage.removeItem('categoryProductState');
    }
  }, []);

  const handleCategoryClick = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

  const handleProductClick = (uid) => {
    router.push(`/product/${uid}`);
  };

  const { startPage, endPage } = getPageRange();

  return (
    <div className="min-h-screen bg-white mt-12">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center flex items-center justify-center gap-3">
          <span className="text-3xl">
            {childName ? `${childName}맘 주목 카테고리` : '맘 주목 카테고리'}
          </span>
        </h1>

        {/* 카테고리 버튼 */}
        <div className="mb-24 mt-12">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`
                    w-20 h-20
                    rounded-full 
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      category === cat.id
                        ? 'bg-orange-400 text-white shadow-lg transform scale-110'
                        : 'bg-orange-50 text-gray-700 hover:bg-pink-100 hover:scale-105'
                    }
                  `}
                >
                  <span className="text-4xl">{cat.icon}</span>
                </button>
                <span className="text-l font-medium text-gray-700">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 상품 목록 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-bounce text-4xl">🍼</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.uid || product._id}
                  onClick={() => handleProductClick(product.uid || product._id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-200 cursor-pointer"
                >
                  <div className="relative group">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.img || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-l font-medium text-gray-700 line-clamp-2">
                        {product.brand || '브랜드 정보 없음'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h2>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {product.site || product.mall || '쇼핑몰 정보 없음'}
                        </p>
                        <p className="text-xl font-bold text-black">
                          {typeof product.sale_price === 'number'
                            ? product.sale_price.toLocaleString() + '원'
                            : product.sale_price ||
                              product.price?.toLocaleString() + '원' ||
                              '가격 정보 없음'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-2">
                  {category === '전체'
                    ? '현재 등록된 상품이 없습니다 🎈'
                    : `${
                        categories.find((c) => c.id === category)?.name ||
                        category
                      } 카테고리에 상품이 없습니다 🎈`}
                </p>
                <p className="text-sm text-gray-400">
                  다른 카테고리를 선택해보세요!
                </p>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full bg-white text-gray-700 border-2 border-pink-200 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← 이전
                </button>

                {/* 페이지 번호 */}
                <div className="flex gap-2">
                  {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, i) => startPage + i
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`
                        w-10 h-10 rounded-full
                        ${
                          pageNum === page
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-white hover:bg-pink-50 text-gray-700'
                        }
                        font-medium
                      `}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {endPage < totalPages && (
                  <button
                    onClick={() => setPage(endPage + 1)}
                    className="px-4 py-2 rounded-full bg-white text-gray-700 border-2 border-pink-200 hover:bg-pink-50"
                  >
                    다음 →
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
