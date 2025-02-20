export async function POST(request) {
  try {
    console.log('Receipt analysis request received');
    const authorization = request.headers.get('Authorization');

    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

    if (!authorization) {
      console.error('Missing Authorization header in receipt analysis request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/upload/analyze',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();
    console.log('Receipt analysis request data:', {
      hasFile: formData.has('file'),
      fileName: formData.get('file')?.name,
    });

    const baseUrl = 'http://hama-image-upload:3002';
    const url = `${baseUrl}/upload/analyze`;
    console.log('Analyzing receipt at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: authorization },
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

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const analysisResult = {
      ...data,
      analyzedAt: new Date().toISOString(),
      items: Array.isArray(data.items)
        ? data.items.map((item) => ({
            ...item,
            price: Number(item.price) || 0,
          }))
        : [],
    };

    console.log('Processed analysis result:', {
      itemCount: analysisResult.items.length,
      totalAmount: analysisResult.items.reduce(
        (sum, item) => sum + item.price,
        0
      ),
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: analysisResult,
        message: '영수증 분석이 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/upload/analyze',
        meta: {
          analyzedAt: analysisResult.analyzedAt,
          itemCount: analysisResult.items.length,
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
    console.error('Receipt Analysis API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: '영수증 분석에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/upload/analyze',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
