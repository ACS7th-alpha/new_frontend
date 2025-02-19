export async function GET(request) {
  try {
    console.log('Products fetch request received');

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('Search parameters:', {
      category: category || 'all',
      keyword: keyword || 'none',
      page,
      limit,
    });

    // 백엔드 URL 구성
    let url = `${process.env.NEXT_PUBLIC_BACKEND_PRODUCT_URL}/products?`;
    const params = new URLSearchParams();

    if (category && category !== '전체') {
      params.append('category', category);
    }
    if (keyword && keyword !== '전체') {
      params.append('keyword', keyword);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('random', Math.random().toString());

    url += params.toString();
    console.log('Fetching products from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
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
            price: product.price || product.sale_price || 0,
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
            keyword: keyword || '전체',
          },
        },
        message: '상품 목록을 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/products',
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
    console.error('Error fetching products:', error);
    return new Response(
      JSON.stringify({
        error: '상품 목록을 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/products',
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
