export async function POST(request) {
  try {
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/register`;
    console.log('Registering user at:', url);
    console.log('Request body:', body);

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
    console.error('Error registering user:', error);
    return Response.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}
