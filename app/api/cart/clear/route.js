export async function DELETE(request) {
  try {
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart/clear`;
    console.log('Clearing cart at:', url);

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
    console.error('Error clearing cart:', error);
    return Response.json(
      { error: 'Failed to clear cart', details: error.message },
      { status: 500 }
    );
  }
}
