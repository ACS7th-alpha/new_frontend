export async function GET(request) {
  try {
    console.log('Product search request received');

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Search parameters:', { category, page, limit });

    // 페이지네이션 유효성 검사
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      console.error('Invalid pagination parameters:', { page, limit });
      return new Response(
        JSON.stringify({
          error: '잘못된 페이지 파라미터입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/search',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 백엔드 URL 구성
    let url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/search?page=${page}&limit=${limit}`;
    if (category && category !== '전체') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    console.log('Fetching products from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend search error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.products.length} products`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          products: data.products.map((product) => ({
            ...product,
            id: product.id || product._id,
            price: product.price || 0,
            category: product.category || '미분류',
            updatedAt: product.updatedAt || new Date().toISOString(),
          })),
          pagination: {
            currentPage: page,
            totalPages: data.totalPages || Math.ceil(data.total / limit),
            totalItems: data.total || data.products.length,
            itemsPerPage: limit,
          },
          filters: {
            category: category || '전체',
          },
          timestamp: new Date().toISOString(),
        },
        message: '상품 목록을 성공적으로 불러왔습니다.',
        path: '/api/search',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return new Response(
      JSON.stringify({
        error: '상품 목록을 불러오는데 실패했습니다.',
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
