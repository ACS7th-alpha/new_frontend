export async function POST(request) {
  try {
    console.log('User registration request received');
    const signupData = await request.json();

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

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/register`;
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
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...data,
          registeredAt: new Date().toISOString(),
        },
        message: '회원가입이 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/auth/register',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering user:', error);
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
