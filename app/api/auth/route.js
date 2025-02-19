export async function POST(request) {
  try {
    console.log('Authentication request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    const body = await request.json();
    console.log('Auth request data:', {
      hasGoogleId: !!body.googleId,
    });

    // 요청 본문 검증
    if (!body.googleId) {
      return new Response(JSON.stringify({ error: 'googleId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 백엔드 URL 확인
    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/google/login`;
    console.log('Authenticating at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', {
      hasAccessToken: !!data.accessToken,
      hasRefreshToken: !!data.refreshToken,
      hasUserData: !!data.user,
    });

    // 응답 데이터 구조 검증 및 변환
    const authData = {
      ...data,
      loginAt: new Date().toISOString(),
      user: {
        ...data.user,
        id: data.user?.id || data.user?._id,
      },
    };

    console.log('Processed auth data:', {
      hasTokens: !!(authData.accessToken && authData.refreshToken),
      userId: authData.user?.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: authData,
        message: '로그인이 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth',
        meta: {
          loginAt: authData.loginAt,
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
    console.error('Auth API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('Account deletion request received');

    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth`;
    console.log('Deleting account at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '계정이 성공적으로 삭제되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth',
        meta: {
          deletedAt: new Date().toISOString(),
        },
      }),
      {
        status: 204,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Account Deletion API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: 'Failed to delete user account', details: error.message },
      { status: 500 }
    );
  }
}
