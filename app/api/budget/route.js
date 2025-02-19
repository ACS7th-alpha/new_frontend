export async function GET(request) {
  try {
    console.log('Budget request received');
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in budget request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log(
      'Authorization header:',
      authorization.substring(0, 15) + '...'
    );

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Fetching budget from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend budget error response:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Budget data successfully fetched');

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
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
    console.error('Error fetching budget:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch budget',
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request) {
  try {
    console.log('Budget creation request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in budget creation request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/budget',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const budgetData = await request.json();
    if (!budgetData.year || !budgetData.month || !budgetData.categories) {
      return new Response(
        JSON.stringify({
          error: '연도, 월, 카테고리별 예산은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/budget',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Creating budget at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(budgetData),
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
        message: '예산이 성공적으로 설정되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating budget:', error);
    return new Response(
      JSON.stringify({
        error: '예산 설정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/budget',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('Budget deletion request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in budget deletion request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/budget',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Deleting budget at:', url);

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
        message: '예산 정보가 성공적으로 삭제되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting budget:', error);
    return new Response(
      JSON.stringify({
        error: '예산 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/budget',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
