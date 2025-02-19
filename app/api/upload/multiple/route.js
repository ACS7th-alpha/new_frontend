export async function POST(request) {
  try {
    console.log('Multiple images upload request received');
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in multiple upload request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/upload/multiple',
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
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      console.error('No images found in form data');
      return new Response(
        JSON.stringify({
          error: '업로드할 이미지가 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/upload/multiple',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log(`Attempting to upload ${files.length} images`);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/upload/multiple`;
    console.log('Uploading images to:', url);

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
      console.error('Backend multiple upload error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Images successfully uploaded');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          urls: data.urls,
          count: data.urls.length,
          uploadedAt: new Date().toISOString(),
        },
        message: `${data.urls.length}개의 이미지가 성공적으로 업로드되었습니다.`,
        timestamp: new Date().toISOString(),
        path: '/api/upload/multiple',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return new Response(
      JSON.stringify({
        error: '이미지 업로드에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/upload/multiple',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
