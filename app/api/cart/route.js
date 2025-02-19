export async function GET(request) {
  try {
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart`;
    console.log('Fetching cart from:', url);

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
    console.error('Error fetching cart:', error);
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
