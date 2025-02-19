export async function GET(request) {
  try {
    console.log('Related reviews fetch request received');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews`;
    console.log('Fetching reviews from:', url);

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
    const normalizedReviews = data.reviews.map((review) => ({
      _id: review._id || review.id,
      title: review.title,
      content: review.content,
      author: review.author,
      createdAt: review.createdAt || new Date().toISOString(),
      updatedAt: review.updatedAt || new Date().toISOString(),
      imageUrl: review.imageUrl || null,
      likes: review.likes || 0,
      comments: review.comments || [],
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: normalizedReviews,
        metadata: {
          totalCount: normalizedReviews.length,
          timestamp: new Date().toISOString(),
        },
        message: '관련 리뷰 목록을 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
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
    console.error('Error fetching related reviews:', error);
    return new Response(
      JSON.stringify({
        error: '관련 리뷰 목록을 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
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

export async function POST(request) {
  try {
    console.log('Review creation request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in review creation request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/reviews',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reviewData = await request.json();
    if (!reviewData.title || !reviewData.content) {
      console.error('Invalid review data:', reviewData);
      return new Response(
        JSON.stringify({
          error: '제목과 내용은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/reviews',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews`;
    console.log('Creating review at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
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
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        },
        message: '리뷰가 성공적으로 등록되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return new Response(
      JSON.stringify({
        error: '리뷰 등록에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('All reviews deletion request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error(
        'Missing Authorization header in all reviews deletion request'
      );
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/reviews',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_REVIEW_URL}/reviews/all`;
    console.log('Deleting all reviews at:', url);

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
        message: '모든 리뷰가 성공적으로 삭제되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting all reviews:', error);
    return new Response(
      JSON.stringify({
        error: '리뷰 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/reviews',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
