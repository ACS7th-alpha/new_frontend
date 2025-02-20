// 새로운 카테고리 전용 검색 엔드포인트
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    console.log('[Category Search] Parameters:', { category, page, limit });

    const baseUrl = 'http://hama-product:3007';
    const url = new URL('/search', baseUrl);
    url.searchParams.set('category', category);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    console.log('[Category Search] Backend URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Category Search] Backend response:', data);

    // 응답 데이터 구조화
    const products = Array.isArray(data.data) ? data.data : [];
    const total = data.meta?.total || 0;

    return Response.json({
      success: true,
      data: products,
      meta: {
        total,
        page,
        limit,
        category,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Category Search] Error:', error);
    return Response.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
