import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '40';

    console.log('[Search API] Request received:', {
      keyword,
      page,
      limit,
      env: process.env.NEXT_PUBLIC_API_URL,
    });

    // 백엤드 API는 /products 엔드포인트를 사용
    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/products?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&limit=${limit}`;
    console.log('[Search API] Calling backend URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      console.error('[Search API] Backend error:', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Search API] Backend response:', {
      status: response.status,
      success: data.success,
      resultCount: data.data?.length || 0,
      firstProduct: data.data?.[0]?.name,
    });

    return NextResponse.json({
      success: true,
      data: data.data || [],
      meta: {
        total: data.total || 0,
        page,
        limit,
        keyword,
      },
    });
  } catch (error) {
    console.error('[Search API] Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return NextResponse.json(
      {
        success: false,
        message: '검색 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
