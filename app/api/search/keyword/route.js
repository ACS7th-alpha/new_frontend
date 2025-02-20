import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '40';

    console.log('[Products API] Request params:', { keyword, page, limit });

    // /api/products 엔드포인트 사용
    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/products?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&limit=${limit}`;
    console.log('[Products API] Calling backend URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    console.log('[Products API] Backend status:', response.status);
    const data = await response.json();
    console.log('[Products API] Backend raw response:', data);

    if (!data.success) {
      console.error('[Products API] Backend error:', data.message);
      return NextResponse.json(data, { status: response.status });
    }

    const result = {
      success: true,
      data: data.data,
      total: data.total || 0,
      meta: {
        total: data.total || 0,
        page,
        limit,
        keyword,
      },
    };

    console.log('[Products API] Sending response:', {
      success: result.success,
      dataLength: result.data?.length,
      total: result.total,
      meta: result.meta,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Products API] Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: '상품 검색 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
