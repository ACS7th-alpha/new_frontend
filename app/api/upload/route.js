export async function POST(request) {
  try {
    const formData = await request.formData();
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/upload/multiple`,
      {
        method: 'POST',
        headers: {
          Authorization: accessToken,
        },
        body: formData,
      }
    );

    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
