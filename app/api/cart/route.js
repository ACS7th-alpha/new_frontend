export async function GET(request) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart`,
      {
        headers: {
          Authorization: request.headers.get('Authorization'),
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch cart', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart/add`,
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
      { error: 'Failed to add to cart', details: error.message },
      { status: 500 }
    );
  }
}
