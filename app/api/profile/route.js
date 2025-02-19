export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/profile`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
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

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;
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
