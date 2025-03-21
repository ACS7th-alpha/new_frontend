'use client';
import { useState, useEffect } from 'react';

export default function TopProducts({ products }) {
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
    }, 2000);

    return () => clearInterval(timer);
  }, [products, totalSlides]);

  if (!products || products.length === 0) return null;

  return (
    <div className="w-3/4 mx-auto">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          {/* 날짜 및 타이틀 섹션 */}
          <div className="mb-2">
            <div className="text-xs text-gray-600">
              {month}월 {date}일 {dayName}요일
            </div>
            <h2 className="text-sm font-bold text-gray-800 flex items-center">
              <span className="mr-1">🏆</span>
              조회수 급상승
            </h2>
          </div>

          {/* 상품 슬라이더 */}
          <div className="relative overflow-hidden">
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
                      <a
                        key={product.PRODUCT_UID}
                        href={product.PRODUCT_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/3 block"
                      >
                        <div className="relative">
                          {/* 순위 뱃지 */}
                          <div className="absolute top-1 left-1 bg-yellow-400 text-white rounded-full px-2 py-0.5 flex items-center justify-center font-bold text-xs shadow-sm z-10">
                            {slideIndex * 3 + index + 1}위
                          </div>
                          {/* 이미지 컨테이너 */}
                          <div className="relative aspect-[1/1] overflow-hidden rounded-md">
                            <img
                              src={product.PRODUCT_IMG}
                              alt={product.PRODUCT_NAME}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          {/* 상품 정보 */}
                          <div className="mt-2">
                            <div className="text-[10px] text-gray-600">
                              {product.PRODUCT_BRAND}
                            </div>
                            <h3 className="text-xs font-semibold text-gray-800 line-clamp-1">
                              {product.PRODUCT_NAME}
                            </h3>
                            <div className="text-sm font-bold text-pink-500">
                              {product.PRODUCT_SALE_PRICE}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              ))}
            </div>

            {/* 진행 상태 표시 */}
            <div className="flex justify-center mt-2 gap-0.5">
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
