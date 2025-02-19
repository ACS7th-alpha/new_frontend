export async function GET(request) {
  try {
    console.log('Product search request received');

    // 요청 파라미터 추출 및 로깅
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Search parameters:', { keyword, category, page, limit });

    // URL 구성
    let url;
    if (keyword) {
      url = `${
        process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL
      }/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`;
    } else if (category) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/products/category/${category}?page=${page}&limit=${limit}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/products?page=${page}&limit=${limit}`;
    }

    console.log('Searching products at:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend search error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const products = Array.isArray(data) ? data : data.products || [];
    const normalizedProducts = products.map((product) => ({
      ...product,
      id: product.id || product._id,
      price: Number(product.price) || 0,
      createdAt: product.createdAt || new Date().toISOString(),
    }));

    console.log('Processed search results:', {
      count: normalizedProducts.length,
      sample: normalizedProducts[0],
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: normalizedProducts,
        message: '검색 결과를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/search',
        meta: {
          total: normalizedProducts.length,
          page,
          limit,
          keyword,
          category,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Search API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: '상품 검색에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/search',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
