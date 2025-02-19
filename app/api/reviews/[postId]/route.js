export async function DELETE(request, { params }) {
  try {
    console.log('Review deletion request received');
    const { postId } = params;
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in review deletion request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: `/api/reviews/${postId}`,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/${postId}`;
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
        deletedId: postId,
        timestamp: new Date().toISOString(),
        path: `/api/reviews/${postId}`,
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
        path: `/api/reviews/${postId}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
