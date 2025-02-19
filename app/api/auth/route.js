export async function POST(request) {
  try {
    // 요청 본문 검증
    const body = await request.json();
    if (!body.googleId) {
      return new Response(JSON.stringify({ error: 'googleId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 백엔드 URL 확인
    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/login`;
    console.log('Auth URL:', url);
    console.log('Request body:', { googleId: body.googleId });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error during authentication:', error);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth`;
    console.log('Deleting user account at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    console.error('Error deleting user account:', error);
    return Response.json(
      { error: 'Failed to delete user account', details: error.message },
      { status: 500 }
    );
  }
}
