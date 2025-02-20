export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[API] Register request received:', body);

    // 백엔드 API 형식에 맞게 데이터 구조화
    const requestData = {
      user: {
        googleId: body.user?.googleId,
        email: body.user?.email,
        name: body.user?.name,
        photo: body.user?.photo,
      },
      additionalInfo: {
        nickname: body.additionalInfo?.nickname,
        monthlyBudget: body.additionalInfo?.monthlyBudget,
        children: body.additionalInfo?.children,
      },
    };

    console.log('[API] Structured register data:', requestData);

    const baseUrl = 'http://hama-auth:3001';
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    console.log('[API] Auth service response:', data);

    if (!response.ok) {
      throw new Error(data.message || '회원가입에 실패했습니다.');
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[API] Register error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || '회원가입 처리 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth/register',
      }),
      {
        status: error.status || 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
