export async function GET(request, { params }) {
  try {
    console.log('Review detail fetch request received');
    const { id } = params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${id}`;
    console.log('Fetching review detail from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '리뷰 상세 정보를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: `/api/reviews/${id}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching review detail:', error);
    return new Response(
      JSON.stringify({
        error: '리뷰 상세 정보를 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: `/api/reviews/${id}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log('Review deletion request received');
    const { id } = params;
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in review deletion request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: `/api/reviews/${id}`,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${id}`;
    console.log('Deleting review at:', url);

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
        message: '리뷰가 성공적으로 삭제되었습니다.',
        deletedId: id,
        timestamp: new Date().toISOString(),
        path: `/api/reviews/${id}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return new Response(
      JSON.stringify({
        error: '리뷰 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: `/api/reviews/${id}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
