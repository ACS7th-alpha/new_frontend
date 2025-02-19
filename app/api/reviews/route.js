export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const url = id
      ? `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews`;

    const response = await fetch(url, {
      headers: {
        Authorization: request.headers.get('Authorization'),
      },
    });
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch reviews', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: request.headers.get('Authorization'),
        },
        body: JSON.stringify(data),
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to create review', details: error.message },
      { status: 500 }
    );
  }
}
