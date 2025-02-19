export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/profile`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/update`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify(data),
      }
    );

    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
