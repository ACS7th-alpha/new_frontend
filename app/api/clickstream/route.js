export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    console.log('클릭스트림 요청 헤더 확인:', {
      hasAuth: !!authorization,
      authType: authorization?.substring(0, 7),
    });

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error('올바른 Authorization 헤더가 없습니다.');
      return new Response(
        JSON.stringify({
          error: 'Valid Bearer token is required',
          timestamp: new Date().toISOString(),
          path: '/api/clickstream',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    console.log('클릭스트림 요청 데이터:', body);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_CLICKSTREAM_URL;
    const url = `${baseUrl}/track-click`;
    console.log('클릭스트림 요청 전송:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('클릭스트림 서비스 에러:', {
        status: response.status,
        error: errorData,
        url: url,
      });
      throw new Error(`클릭스트림 서비스 에러: ${response.status}`);
    }

    const data = await response.json();
    console.log('클릭스트림 서비스 응답:', data);

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '클릭스트림 데이터가 성공적으로 전송되었습니다.',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('클릭스트림 서비스 에러:', error);
    return new Response(
      JSON.stringify({
        error: '클릭스트림 데이터 전송에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
