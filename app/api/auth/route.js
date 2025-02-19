export async function POST(request) {
  try {
    const data = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: 'Authentication failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/delete`,
      {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Delete failed', details: error.message },
      { status: 500 }
    );
  }
}
