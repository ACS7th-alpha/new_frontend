export async function POST(request) {
  try {
    console.log('User registration request received');

    const signupData = await request.json();
    console.log('Registration data:', {
      hasEmail: !!signupData.email,
      hasPassword: !!signupData.password,
      hasNickname: !!signupData.nickname,
    });

    // 필수 필드 검증
    if (!signupData.email || !signupData.password || !signupData.nickname) {
      return new Response(
        JSON.stringify({
          error: '이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/auth/register',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = 'http://hama-auth:3001';
    const url = `${baseUrl}/auth/register`;
    console.log('Registering user at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const userData = {
      ...data,
      registeredAt: new Date().toISOString(),
      id: data.id || data._id,
      email: data.email,
      nickname: data.nickname,
    };

    console.log('Processed user data:', {
      userId: userData.id,
      email: userData.email,
      registeredAt: userData.registeredAt,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: userData,
        message: '회원가입이 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth/register',
        meta: {
          registeredAt: userData.registeredAt,
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Registration API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: '회원가입에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/auth/register',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
