export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in clickstream request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/clickstream',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    console.log('Clickstream data received:', data);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_CLICKSTREAM_URL;
    const response = await fetch(`${baseUrl}/track-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend clickstream error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '클릭스트림 데이터가 성공적으로 전송되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/clickstream',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
        },
      }
    );
  } catch (error) {
    console.error('Clickstream API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: '클릭스트림 데이터 전송에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/clickstream',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
