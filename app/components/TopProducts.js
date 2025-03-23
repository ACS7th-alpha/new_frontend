'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TopProducts({ products }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[today.getDay()];

  const totalSlides = Math.ceil(products?.length / 3);

  useEffect(() => {
    if (!products || products.length <= 3) return;

    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [products, totalSlides]);

  // 간단한 상품 클릭 핸들러
  const handleProductClick = (product) => {
    router.push(`/product/${product.PRODUCT_UID}`);
  };

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? totalSlides - 1 : current - 1
    );
  };

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === totalSlides - 1 ? 0 : current + 1
    );
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-3/4 mx-auto">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4">
          {/* 날짜 및 타이틀 섹션 */}
          <div className="mb-2">
            <div className="text-sm text-gray-600">
              {month}월 {date}일 {dayName}요일
            </div>
            <h2 className="text-base font-bold text-gray-800 flex items-center">
              <span className="mr-1">🏆</span>
              나와 같은 조건의 자녀를 둔 엄마들의 조회수 급상승 상품
            </h2>
          </div>

          {/* 상품 슬라이더 */}
          <div className="relative overflow-hidden">
            {/* 이전 버튼 */}
            {products.length > 3 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* 슬라이더 컨텐츠 */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex w-full flex-shrink-0 gap-4"
                >
                  {products
                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                    .map((product, index) => (
                      <div
                        key={product.PRODUCT_UID}
                        onClick={() => handleProductClick(product)}
                        className="w-1/3 block cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="relative">
                          {/* 순위 뱃지 */}
                          <div className="absolute top-2 left-2 bg-yellow-400 text-white rounded-full px-3 py-1 flex items-center justify-center font-bold text-sm z-10">
                            {slideIndex * 3 + index + 1}위
                          </div>
                          {/* 이미지 컨테이너 */}
                          <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                            <img
                              src={product.PRODUCT_IMG}
                              alt={product.PRODUCT_NAME}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          {/* 상품 정보 */}
                          <div className="mt-3">
                            <div className="text-sm text-gray-600 mb-1">
                              {product.PRODUCT_BRAND}
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                              {product.PRODUCT_NAME}
                            </h3>
                            <div className="text-lg font-bold text-pink-500">
                              {product.PRODUCT_SALE_PRICE}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* 다음 버튼 */}
            {products.length > 3 && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* 진행 상태 표시 */}
            <div className="flex justify-center mt-3 gap-0.5">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-4 bg-yellow-400'
                      : 'w-1 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
