import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '40';

    console.log('[Search API] Searching with:', {
      keyword,
      page,
      limit,
    });

    // 백엔드 API 호출
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/products/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('[Search API] Backend response:', {
      success: data.success,
      count: data.data?.length || 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Search API] Error:', error.message);
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
