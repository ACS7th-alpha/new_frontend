export async function GET(request) {
  try {
    console.log('Cart items fetch request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_CART_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in cart fetch request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/cart',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart`;
    console.log('Fetching cart items from:', url);

    const response = await fetch(url, {
      headers: { Authorization: authorization },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const items = Array.isArray(data.items) ? data.items : [];
    const normalizedItems = items.map((item) => ({
      ...item,
      id: item.id || item._id,
      price: item.price || item.sale_price || 0,
      quantity: item.quantity || 1,
    }));

    console.log('Processed cart items:', {
      count: normalizedItems.length,
      sample: normalizedItems[0], // 첫 번째 아이템 데이터 샘플
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          items: normalizedItems,
          totalItems: normalizedItems.length,
          totalAmount: normalizedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        },
        message: '장바구니 목록을 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/cart',
        meta: {
          total: normalizedItems.length,
          updatedAt: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Cart API Error:', {
      message: error.message,
      stack: error.stack,
    });
    console.error('Error fetching cart items:', error);
    return new Response(
      JSON.stringify({
        error: '장바구니 목록을 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/cart',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    console.log('Cart item addition request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in cart addition request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/cart',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const productData = await request.json();
    if (!productData.uid || !productData.name) {
      return new Response(
        JSON.stringify({
          error: '상품 정보가 올바르지 않습니다.',
          timestamp: new Date().toISOString(),
          path: '/api/cart',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
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
        message: '장바구니에 상품이 추가되었습니다.',
        data: {
          productId: productData.uid,
          timestamp: new Date().toISOString(),
        },
        path: '/api/cart',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return new Response(
      JSON.stringify({
        error: '장바구니 추가에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/cart',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
