export async function GET(request) {
  try {
    console.log('Products fetch request received');

    // 환경변수 디버깅
    console.log('Backend URL:', {
      search_url: process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL,
      node_env: process.env.NODE_ENV,
    });

    // URL 파라미터 처리
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const category = searchParams.get('category') || 'all';
    const keyword = searchParams.get('keyword') || 'none';

    console.log('Search parameters:', { category, keyword, page, limit });

    // 백엤드 URL이 없는 경우 기본값 사용
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL || 'http://hama-product:3007';

    // URL 구성
    const url = new URL('/products', baseUrl);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    if (category !== 'all') url.searchParams.set('category', category);
    if (keyword !== 'none') url.searchParams.set('keyword', keyword);

    console.log('Requesting URL:', url.toString());

    const response = await fetch(url, {
      method: 'GET',
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
    return Response.json(
      {
        success: true,
        data: data,
        message: '상품 목록을 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/products',
      },
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
    return Response.json(
      {
        error: '상품 목록을 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/products',
      },
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
