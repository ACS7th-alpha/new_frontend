export async function POST(request) {
  try {
    console.log('=== 인증 요청 시작 ===');
    console.log('요청 시간:', new Date().toISOString());

    const requestBody = await request.json();
    console.log('요청 데이터:', {
      googleId: requestBody.googleId,
      requestHeaders: Object.fromEntries(request.headers),
    });

    // 요청 본문 검증
    if (!requestBody.googleId) {
      console.error('googleId 누락됨');
      return new Response(JSON.stringify({ error: 'googleId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_AUTH_URL;
    const url = `${baseUrl}/auth/google/login`;
    console.log('백엔드 요청 정보:', {
      url: url,
      method: 'POST',
      googleId: requestBody.googleId
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('백엔드 응답 정보:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('백엔드 에러 응답:', {
        status: response.status,
        errorText: errorText,
        headers: Object.fromEntries(response.headers),
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('백엔드 응답 데이터:', {
      success: true,
      statusCode: response.status,
      data: {
        access_token: data.access_token ? `${data.access_token.substring(0, 10)}...` : null,
        refresh_token: data.refresh_token ? `${data.refresh_token.substring(0, 10)}...` : null,
        user: {
          googleId: data.user?.googleId,
          email: data.user?.email,
          name: data.user?.name,
          nickname: data.user?.nickname,
          hasPhoto: !!data.user?.photo,
          monthlyBudget: data.user?.monthlyBudget,
          childrenCount: data.user?.children?.length
        }
      }
    });

    // 클라이언트로 전달할 응답 데이터
    const responseData = {
      statusCode: 200,
      message: "Login successful",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    };

    console.log('=== 인증 요청 완료 ===');

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, private',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    console.error('인증 API 에러:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: '인증에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/auth',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
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
