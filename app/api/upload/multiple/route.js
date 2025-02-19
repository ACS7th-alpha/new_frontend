export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');

    // FormData를 그대로 전달
    const formData = await request.formData();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/upload/multiple`;
    console.log('Uploading multiple images to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        // Content-Type은 설정하지 않음 (multipart/form-data를 위해)
      },
      body: formData, // FormData 그대로 전달
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error uploading images:', error);
    return Response.json(
      { error: 'Failed to upload images', details: error.message },
      { status: 500 }
    );
  }
}
