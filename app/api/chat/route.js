export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

    if (!authorization) {
      console.error('Missing Authorization header in chat request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/chat',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 요청 본문 검증
    const questionData = await request.json();
    console.log('Chat request data:', {
      hasMessage: !!questionData.message,
      messageLength: questionData.message?.length,
      hasContext: !!questionData.context,
    });

    if (!questionData.message) {
      console.error('Missing message in request body');
      return new Response(
        JSON.stringify({
          error: '메시지 내용이 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/chat',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const baseUrl = 'http://hama-chat:3009';
    const url = `${baseUrl}/chat`;
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

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const chatResponse = {
      message: data.message,
      messageId: data.messageId || crypto.randomUUID(),
      context: data.context || questionData.context,
      timestamp: new Date().toISOString(),
    };

    console.log('Processed chat response:', {
      hasMessage: !!chatResponse.message,
      messageId: chatResponse.messageId,
      hasContext: !!chatResponse.context,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: chatResponse,
        message: '챗봇 응답이 성공적으로 생성되었습니다.',
        timestamp: chatResponse.timestamp,
        path: '/api/chat',
        meta: {
          messageId: chatResponse.messageId,
          generatedAt: chatResponse.timestamp,
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
    console.error('Chat API Error:', {
      message: error.message,
      stack: error.stack,
    });
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
