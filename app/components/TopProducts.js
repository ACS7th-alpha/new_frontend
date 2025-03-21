'use client';
import { useState, useEffect } from 'react';

export default function TopProducts({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 오늘 날짜 포맷팅
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[today.getDay()];

  useEffect(() => {
    if (!products || products.length === 0) return;

    // 2초로 변경
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % products.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [products]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="max-w-xl mx-auto px-2 py-2">
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
          <div className="relative">
            <a
              href={currentProduct.PRODUCT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative">
                {/* 순위 뱃지 */}
                <div className="absolute top-1 left-1 bg-yellow-400 text-white rounded-full px-2 py-0.5 flex items-center justify-center font-bold text-xs shadow-sm z-10">
                  {currentIndex + 1}위
                </div>
                {/* 이미지 컨테이너 */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <img
                    src={currentProduct.PRODUCT_IMG}
                    alt={currentProduct.PRODUCT_NAME}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* 상품 정보 */}
                <div className="mt-2">
                  <div className="text-[10px] text-gray-600">
                    {currentProduct.PRODUCT_BRAND}
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {currentProduct.PRODUCT_NAME}
                  </h3>
                  <div className="text-sm font-bold text-pink-500">
                    {currentProduct.PRODUCT_SALE_PRICE}
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* 진행 상태 표시 */}
          <div className="flex justify-center mt-2 gap-0.5">
            {products.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-4 bg-yellow-400'
                    : 'w-1 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
