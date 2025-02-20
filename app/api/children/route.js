export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    console.log('Authorization header:', accessToken ? 'Present' : 'Missing');

    const baseUrl = 'http://hama-auth:3001';
    const url = `${baseUrl}/auth/children`;
    console.log('Fetching children data from:', url);

    const response = await fetch(url, {
      headers: { Authorization: accessToken },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend children fetch error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const children = Array.isArray(data)
      ? data.map((child) => ({
          ...child,
          id: child.id || child._id,
          createdAt: child.createdAt || new Date().toISOString(),
        }))
      : [];

    console.log('Processed children data:', {
      count: children.length,
      sample: children[0],
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: children,
        message: '자녀 목록을 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/children',
        meta: {
          total: children.length,
          fetchedAt: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Children API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: 'Failed to fetch children', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('[Children API] POST: Adding new child');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('[Children API] POST: Missing Authorization header');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    console.log('[Children API] POST: Request body:', requestBody);

    const baseUrl = 'http://hama-auth:3001';
    const response = await fetch(`${baseUrl}/auth/children`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Children API] POST: Backend error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Children API] POST Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    console.log('[Children API] DELETE: Removing child');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('[Children API] DELETE: Missing Authorization header');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const childName = searchParams.get('name');

    if (!childName) {
      console.error('[Children API] DELETE: Missing child name');
      return new Response(
        JSON.stringify({
          error: '삭제할 아이의 이름이 필요합니다.',
          timestamp: new Date().toISOString(),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Children API] DELETE: Removing child:', childName);

    const baseUrl = 'http://hama-auth:3001';
    const response = await fetch(
      `${baseUrl}/auth/children/${encodeURIComponent(childName)}`,
      {
        method: 'DELETE',
        headers: { Authorization: authorization },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Children API] DELETE: Backend error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '아이 정보가 삭제되었습니다.',
        deletedName: childName,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Children API] DELETE Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
