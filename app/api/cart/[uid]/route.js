export async function DELETE(request, { params }) {
  try {
    console.log('Cart item deletion request received');
    const { uid } = params;
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error(
        'Missing Authorization header in cart item deletion request'
      );
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: `/api/cart/${uid}`,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart/${uid}`;
    console.log('Deleting cart item at:', url);

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
        message: '장바구니에서 상품이 삭제되었습니다.',
        deletedId: uid,
        timestamp: new Date().toISOString(),
        path: `/api/cart/${uid}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return new Response(
      JSON.stringify({
        error: '장바구니 상품 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: `/api/cart/${uid}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
