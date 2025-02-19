export async function GET(request, { params }) {
  try {
    const { id } = params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${id}`;
    console.log('Fetching review detail from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching review detail:', error);
    return Response.json(
      { error: 'Failed to fetch review detail', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authorization = request.headers.get('Authorization');
    const { id } = params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${id}`;
    console.log('Deleting review at:', url);

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
    console.error('Error deleting review:', error);
    return Response.json(
      { error: 'Failed to delete review', details: error.message },
      { status: 500 }
    );
  }
}
