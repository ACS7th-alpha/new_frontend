export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;

    let url;
    if (keyword) {
      url = `${
        process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL
      }/products/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`;
    } else if (category) {
      url = `${
        process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL
      }/products/category/${encodeURIComponent(
        category
      )}?page=${page}&limit=${limit}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BACKEND_SEARCH_URL}/products?page=${page}&limit=${limit}`;
    }

    const response = await fetch(url);
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}
