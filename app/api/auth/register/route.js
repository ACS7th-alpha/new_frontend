export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[API] Register request received:', body);

    // 요청 데이터 구조화
    const { user, additionalInfo } = body;

    // 회원가입 요청 데이터 구성
    const registerData = {
      email: user?.email,
      googleId: user?.googleId,
      name: user?.name,
      photo: user?.photo,
      nickname: additionalInfo?.nickname,
      monthlyBudget: additionalInfo?.monthlyBudget,
      children: additionalInfo?.children,
      password: user?.googleId, // Google ID를 임시 비밀번호로 사용
    };

    console.log('[API] Structured register data:', registerData);

    const baseUrl = 'http://hama-auth:3001';
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
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
