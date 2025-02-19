export async function GET(request) {
  try {
    console.log('Products fetch request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    // 요청 URL에서 검색 파라미터 추출
    const requestUrl = new URL(request.url);
    const page = requestUrl.searchParams.get('page') || '1';
    const limit = requestUrl.searchParams.get('limit') || '20';

    // 백엔드 요청 URL 구성
    const baseUrl = 'http://hama-product:3007';
    const url = new URL('/products', baseUrl);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    console.log('Fetching from:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증
    const products = Array.isArray(data) ? data : data.data || [];

    console.log('Processed products:', {
      count: products.length,
      sample: products[0], // 첫 번째 상품 데이터 샘플
    });

    return Response.json({
      success: true,
      data: products,
      message: '상품 목록을 성공적으로 불러왔습니다.',
      timestamp: new Date().toISOString(),
      path: '/api/products',
      meta: {
        total: products.length,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Products API Error:', {
      message: error.message,
      stack: error.stack,
    });

    return Response.json(
      {
        error: '상품 목록을 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/products',
      },
      { status: 500 }
    );
  }
}
