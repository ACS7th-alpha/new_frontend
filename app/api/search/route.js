export async function GET(request) {
  try {
    console.log('Product search request received');
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Search parameters:', { keyword, category, page, limit });

    let url;
    if (keyword) {
      url = `${
        process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL
      }/products/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`;
    } else if (category) {
      url = `${
        process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL
      }/products/category/${encodeURIComponent(
        category
      )}?page=${page}&limit=${limit}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/products?page=${page}&limit=${limit}`;
    }

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
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          products: data.products.map((product) => ({
            ...product,
            id: product.id || product._id,
            price: product.price || 0,
            updatedAt: product.updatedAt || new Date().toISOString(),
          })),
          pagination: {
            currentPage: page,
            totalPages: data.totalPages || Math.ceil(data.total / limit),
            totalItems: data.total || data.products.length,
            itemsPerPage: limit,
          },
        },
        message: '상품 검색 결과를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
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
