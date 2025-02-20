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

    // Docker 컨테이너 간 통신을 위한 내부 URL
    const baseUrl =
      process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://hama-cart:3003';
    console.log('[Cart API] Using base URL:', baseUrl);
    const url = `${baseUrl}/cart`;
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
    const accessToken = request.headers.get('Authorization');
    console.log('[Cart API] Request received:', {
      hasToken: !!accessToken,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });

    const cartData = await request.json();
    console.log('[Cart API] Request body:', {
      uid: cartData.uid,
      name: cartData.name,
      category: cartData.category,
      price: cartData.sale_price,
    });

    const baseUrl = 'http://hama-cart:3003';
    console.log('[Cart API] Forwarding request to:', `${baseUrl}/cart`);

    const response = await fetch(`${baseUrl}/cart`, {
      method: 'POST',
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    });

    console.log('[Cart API] Backend response details:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cart API] Backend error response:', {
        status: response.status,
        error: errorText,
      });

      return new Response(
        JSON.stringify({
          error: '장바구니 추가에 실패했습니다.',
          details: `HTTP error! status: ${response.status}, message: ${errorText}`,
          timestamp: new Date().toISOString(),
          path: '/api/cart',
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    console.log('[Cart API] Backend success response:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Cart API] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({
        error: '장바구니 추가에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/cart',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
