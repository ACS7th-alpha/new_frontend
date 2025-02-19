export async function GET(request) {
  try {
    console.log('Children fetch request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    const accessToken = request.headers.get('Authorization');
    console.log('Authorization header:', accessToken ? 'Present' : 'Missing');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/children`;
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
    console.log('Child registration request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error(
        'Missing Authorization header in child registration request'
      );
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    if (!requestBody.name) {
      return new Response(
        JSON.stringify({
          error: '아이의 이름은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/children`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '아이 정보가 성공적으로 등록되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 등록에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('Child update request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in child update request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    if (!requestBody.name) {
      return new Response(
        JSON.stringify({
          error: '아이의 이름은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/children`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '아이 정보가 성공적으로 수정되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 정보 수정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('Child deletion request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in child deletion request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    if (!name) {
      return new Response(
        JSON.stringify({
          error: '삭제할 아이의 이름이 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/children?name=${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: authorization },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '아이 정보가 성공적으로 삭제되었습니다.',
        deletedName: name,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 정보 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
