export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    console.log('Receipt analysis request data:', {
      hasFile: !!file,
      fileName: file?.name,
    });

    const baseUrl = 'http://hama-image-upload:3002';
    const url = `${baseUrl}/analyze`;

    // 파일명만 전송
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: file.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend receipt analysis error:', {
        status: response.status,
        error: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '영수증 분석이 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/upload/analyze',
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
    console.error('Receipt Analysis API Error:', error);
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
