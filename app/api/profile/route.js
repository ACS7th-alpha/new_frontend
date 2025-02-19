export async function GET(request) {
  try {
    console.log('Profile fetch request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

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
      console.error('Backend profile fetch error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const profileData = {
      ...data,
      id: data.id || data._id,
      lastUpdated: new Date().toISOString(),
    };

    console.log('Processed profile data:', {
      userId: profileData.id,
      email: profileData.email,
      hasAvatar: !!profileData.avatar,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: profileData,
        message: '프로필 정보를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/profile',
        meta: {
          lastUpdated: profileData.lastUpdated,
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
    console.error('Profile API Error:', {
      message: error.message,
      stack: error.stack,
    });
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

export async function PUT(request) {
  try {
    console.log('Profile update request received');

    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

    const requestBody = await request.json();
    console.log('Profile update data:', {
      hasNickname: !!requestBody.nickname,
      hasAvatar: !!requestBody.avatar,
    });

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/profile`;
    console.log('Updating profile at:', url);

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
      console.error('Backend profile update error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const updatedProfile = {
      ...data,
      id: data.id || data._id,
      updatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedProfile,
        message: '프로필이 성공적으로 수정되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/profile',
        meta: {
          updatedAt: updatedProfile.updatedAt,
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
    console.error('Profile Update API Error:', {
      message: error.message,
      stack: error.stack,
    });
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
