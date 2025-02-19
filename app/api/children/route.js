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
    const data = await request.json();
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/children`,
      {
        method: 'POST',
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
      { error: 'Failed to add child', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { name, ...updateData } = data;
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_AUTH_URL
      }/auth/children/${encodeURIComponent(name)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify(updateData),
      }
    );

    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to update child', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_AUTH_URL
      }/auth/children/${encodeURIComponent(name)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
        },
      }
    );

    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete child', details: error.message },
      { status: 500 }
    );
  }
}
