export async function GET(request, { params }) {
  try {
    const { uid } = params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/products/${uid}`;
    console.log('Fetching product detail from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return Response.json(
      { error: 'Failed to fetch product detail', details: error.message },
      { status: 500 }
    );
  }
}
