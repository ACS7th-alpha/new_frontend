import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { keyword } = params; // URL path에서 keyword 추출
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '40';

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL;
    
    // 새로운 형식의 백엔드 URL 구성
    const apiUrl = `${baseUrl}/products/search/${encodeURIComponent(keyword)}?page=${page}&limit=${limit}`;

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
    
    return NextResponse.json({
      success: true,
      data: data.data || [],
      meta: {
        total: data.total || 0,
        page: Number(page),
        limit: Number(limit),
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