'use client';

export default function TopProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🏆</span>
          오늘의 인기 육아용품
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, index) => (
            <a
              key={product.PRODUCT_UID}
              href={product.PRODUCT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                {/* 순위 뱃지 */}
                <div className="absolute top-2 left-2 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md">
                  {index + 1}
                </div>
                <div className="relative pb-[100%] overflow-hidden">
                  <img
                    src={product.PRODUCT_IMG}
                    alt={product.PRODUCT_NAME}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {product.PRODUCT_BRAND}
                </div>
                <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.PRODUCT_NAME}
                </h3>
                <div className="text-lg font-bold text-pink-500">
                  {product.PRODUCT_SALE_PRICE}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
