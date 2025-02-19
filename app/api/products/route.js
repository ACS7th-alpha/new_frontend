export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const random = searchParams.get('random');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL;
    let url;

    if (!category || category === '전체') {
      url = `${baseUrl}/products?random=${random}`;
    } else {
      url = `${baseUrl}/products/category/${encodeURIComponent(
        category
      )}?random=${random}`;
    }

    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}
