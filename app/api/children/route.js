export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/children`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch children', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/children`;
    console.log('Creating child at:', url);
    console.log('Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
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
    console.error('Error creating child:', error);
    return Response.json(
      { error: 'Failed to create child', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/children`;
    console.log('Updating child at:', url);
    console.log('Request body:', body);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: authorization,
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
    console.error('Error updating child:', error);
    return Response.json(
      { error: 'Failed to update child', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      throw new Error('Child name is required');
    }

    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_AUTH_URL
    }/children?name=${encodeURIComponent(name)}`;
    console.log('Deleting child at:', url);

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
    console.error('Error deleting child:', error);
    return Response.json(
      { error: 'Failed to delete child', details: error.message },
      { status: 500 }
    );
  }
}
