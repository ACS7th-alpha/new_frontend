export async function POST(request) {
  try {
    const body = await request.json();

    // 백엔드 URL 확인
    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/login`;
    console.log('Auth URL:', url); // 디버깅용

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error during authentication:', error);
    return Response.json(
      { error: 'Authentication failed', details: error.message },
      { status: 500 }
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
