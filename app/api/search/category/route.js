// 새로운 카테고리 전용 검색 엔드포인트
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    console.log('[Category Search] Parameters:', { category, page, limit });

    const baseUrl = 'http://hama-product:3007';
    // 백엔드 API 경로 수정
    const url = new URL(
      `/products/category/${encodeURIComponent(category)}`,
      baseUrl
    );
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
      console.error('[Category Search] Backend error:', {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error('[Category Search] Error details:', errorText);
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Category Search] Backend response:', data);

    // 응답 데이터 구조화
    const products = Array.isArray(data) ? data : data.data || [];
    const total = data.meta?.total || products.length;

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
        status: error.message.includes('Backend error: 400') ? 400 : 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
