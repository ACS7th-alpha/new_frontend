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

    // 1.5초마다 다음 상품으로 이동
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % products.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [products]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        {/* 날짜 및 타이틀 섹션 */}
        <div className="mb-6">
          <div className="text-gray-600 mb-2">
            {month}월 {date}일 {dayName}요일
          </div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">🏆</span>
            오늘 가장 많이 본 육아용품
          </h2>
          <p className="text-gray-600 mt-2">
            {currentProduct.PRODUCT_CATEGORY} 카테고리에서 가장 인기있는
            제품이에요
          </p>
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
                <div className="absolute top-3 left-3 bg-yellow-400 text-white rounded-full px-4 py-2 flex items-center justify-center font-bold text-lg shadow-md z-10">
                  {currentIndex + 1}위
                </div>
                {/* 이미지 컨테이너 */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={currentProduct.PRODUCT_IMG}
                    alt={currentProduct.PRODUCT_NAME}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* 상품 정보 */}
                <div className="mt-4">
                  <div className="text-gray-600 mb-2">
                    {currentProduct.PRODUCT_BRAND}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {currentProduct.PRODUCT_NAME}
                  </h3>
                  <div className="text-2xl font-bold text-pink-500">
                    {currentProduct.PRODUCT_SALE_PRICE}
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* 진행 상태 표시 */}
          <div className="flex justify-center mt-6 gap-2">
            {products.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-yellow-400'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
