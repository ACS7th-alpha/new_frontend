export async function GET(request) {
  try {
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/my-reviews`;
    console.log('Fetching my reviews from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    return Response.json(
      { error: 'Failed to fetch my reviews', details: error.message },
      { status: 500 }
    );
  }
}
