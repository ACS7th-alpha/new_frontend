export async function DELETE(request) {
  try {
    console.log('Cart clear request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in cart clear request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/cart/clear',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart/clear`;
    console.log('Clearing cart at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: authorization },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '장바구니가 비워졌습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/cart/clear',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error clearing cart:', error);
    return new Response(
      JSON.stringify({
        error: '장바구니 비우기에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/cart/clear',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
