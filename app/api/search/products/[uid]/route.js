export async function GET(request, { params }) {
  try {
    console.log('Product detail fetch request received');
    const { uid } = params;

    if (!uid) {
      return new Response(
        JSON.stringify({
          error: '상품 ID가 필요합니다.',
          timestamp: new Date().toISOString(),
          path: `/api/search/products/${uid}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_PRODUCT_URL}/products/${uid}`;
    console.log('Fetching product details from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Product details successfully fetched');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...data,
          id: data.id || data._id,
          price: data.price || data.sale_price || 0,
          updatedAt: data.updatedAt || new Date().toISOString(),
        },
        message: '상품 정보를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: `/api/search/products/${uid}`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching product details:', error);
    return new Response(
      JSON.stringify({
        error: '상품 정보를 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: `/api/search/products/${uid}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
