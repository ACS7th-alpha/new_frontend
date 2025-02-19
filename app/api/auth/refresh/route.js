export async function POST(request) {
  try {
    console.log('Token refresh request received');

    // 요청 본문 검증
    const requestData = await request.json();
    if (!requestData.refreshToken) {
      console.error('Missing refresh token in request');
      return new Response(
        JSON.stringify({
          error: 'Refresh token is required',
          timestamp: new Date().toISOString(),
          path: '/api/auth/refresh',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }
    console.log('Refresh token received');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/refresh`;
    console.log('Requesting token refresh at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: requestData.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend token refresh error:', errorText);

      // 401 상태 코드인 경우 특별 처리
      if (response.status === 401) {
        return new Response(
          JSON.stringify({
            error: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.',
            code: 'TOKEN_EXPIRED',
            timestamp: new Date().toISOString(),
            path: '/api/auth/refresh',
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
      }

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Token refresh successful');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn || 3600,
          tokenType: 'Bearer',
          issuedAt: new Date().toISOString(),
        },
        message: '토큰이 성공적으로 갱신되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth/refresh',
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
    console.error('Error refreshing token:', error);
    return new Response(
      JSON.stringify({
        error: '토큰 갱신에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/auth/refresh',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
