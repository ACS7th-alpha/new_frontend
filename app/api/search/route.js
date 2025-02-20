import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '40';

    console.log('Search parameters:', { keyword, page, limit });

    // 백엔드 검색 API 호출
    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/search?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&limit=${limit}`;
    console.log('Searching products from:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    const data = await response.json();
    console.log('Backend search response:', {
      status: response.status,
      success: data.success,
      resultCount: data.data?.length || 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API Error:', error);
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
