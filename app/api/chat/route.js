export async function POST(request) {
  try {
    console.log('Chat request received');
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in chat request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/chat',
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

    // 요청 본문 검증
    const questionData = await request.json();
    if (!questionData.message) {
      console.error('Missing message in request body');
      return new Response(
        JSON.stringify({
          error: '메시지 내용이 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/chat',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log('Chat message received:', {
      messageLength: questionData.message.length,
      context: questionData.context || 'none',
    });

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CHAT_URL}/chat`;
    console.log('Sending chat request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend chat error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Chat response successfully received');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          message: data.message,
          timestamp: new Date().toISOString(),
          messageId: data.messageId || crypto.randomUUID(),
          context: data.context || questionData.context,
        },
        message: '챗봇 응답이 성공적으로 생성되었습니다.',
        path: '/api/chat',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(
      JSON.stringify({
        error: '챗봇 응답 생성에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/chat',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
