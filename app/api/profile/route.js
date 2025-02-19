export async function GET(request) {
  try {
    console.log('Profile fetch request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in profile fetch request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/profile',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/profile`;
    console.log('Fetching profile from:', url);

    const response = await fetch(url, {
      headers: { Authorization: authorization },
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
        message: '프로필 정보를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/profile',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({
        error: '프로필 정보를 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/profile',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request) {
  try {
    console.log('Profile update request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in profile update request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/profile',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    if (!requestBody.nickname) {
      return new Response(
        JSON.stringify({
          error: '닉네임은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/profile',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/profile`;
    console.log('Updating profile at:', url);

    const response = await fetch(url, {
      method: 'PATCH',
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
        message: '프로필이 성공적으로 수정되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/profile',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(
      JSON.stringify({
        error: '프로필 수정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/profile',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
