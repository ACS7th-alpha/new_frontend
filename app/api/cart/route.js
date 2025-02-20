export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    console.log('[Cart API] GET Request received:', {
      hasToken: !!accessToken,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });

    const baseUrl = 'http://hama-cart:3008';
    console.log('[Cart API] Fetching cart items from:', `${baseUrl}/cart`);

    const response = await fetch(`${baseUrl}/cart`, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Cart API] GET Backend response details:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cart API] GET Backend error response:', {
        status: response.status,
        error: errorText,
      });

      return new Response(
        JSON.stringify({
          error: '장바구니 조회에 실패했습니다.',
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
    console.log('[Cart API] GET Backend success response:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Cart API] GET Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({
        error: '장바구니 조회에 실패했습니다.',
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

export async function POST(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    console.log('[Cart API] POST Request received:', {
      hasToken: !!accessToken,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });

    const cartData = await request.json();
    console.log('[Cart API] Request body:', cartData);

    const baseUrl = 'http://hama-cart:3008';
    // 정확한 엔드포인트로 수정 (예: /cart/add 또는 /cart/items)
    const endpoint = '/cart/add'; // 또는 실제 백엔드 엔드포인트

    console.log('[Cart API] Sending request to:', `${baseUrl}${endpoint}`);

    const response = await fetch(`${baseUrl}${endpoint}`, {
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

export async function DELETE(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    console.log('[Cart API] DELETE Request received:', {
      hasToken: !!accessToken,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });

    // URL에서 상품 ID 추출
    const uid = request.url.split('/').pop();
    console.log('[Cart API] Deleting item with UID:', uid);

    const baseUrl = 'http://hama-cart:3008';
    const endpoint = `/cart/remove/${uid}`;

    console.log(
      '[Cart API] Sending DELETE request to:',
      `${baseUrl}${endpoint}`
    );

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Cart API] DELETE Backend response details:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cart API] DELETE Backend error response:', {
        status: response.status,
        error: errorText,
      });

      return new Response(
        JSON.stringify({
          error: '상품 삭제에 실패했습니다.',
          details: `HTTP error! status: ${response.status}, message: ${errorText}`,
          timestamp: new Date().toISOString(),
          path: `/api/cart/${uid}`,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(null, {
      status: 204, // No Content
    });
  } catch (error) {
    console.error('[Cart API] DELETE Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({
        error: '상품 삭제 중 오류가 발생했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: request.url,
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
