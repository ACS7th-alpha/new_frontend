export async function POST(request) {
  try {
    console.log('Receipt analysis request received');
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in receipt analysis request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/upload/analyze',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log(
      'Authorization header:',
      authorization.substring(0, 15) + '...'
    );

    // FormData 검증
    const formData = await request.formData();
    if (!formData.has('file')) {
      console.error('No file found in form data');
      return new Response(
        JSON.stringify({
          error: '영수증 이미지가 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/upload/analyze',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/upload/analyze`;
    console.log('Sending receipt for analysis to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        // Content-Type은 FormData를 사용할 때 자동으로 설정됨
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend receipt analysis error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Receipt successfully analyzed');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...data,
          analyzedAt: new Date().toISOString(),
        },
        message: '영수증 분석이 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/upload/analyze',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    return new Response(
      JSON.stringify({
        error: '영수증 분석에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/upload/analyze',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
