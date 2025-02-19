export async function GET(request) {
  try {
    console.log('Budget request received');

    // 디버깅을 위한 로그
    console.log('Request URL:', request.url);
    console.log('Environment:', {
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

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

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const budgetData = {
      ...data,
      id: data.id || data._id,
      amount: Number(data.amount) || 0,
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    console.log('Processed budget data:', {
      budgetId: budgetData.id,
      amount: budgetData.amount,
      updatedAt: budgetData.updatedAt,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: budgetData,
        message: '예산 정보를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget',
        meta: {
          updatedAt: budgetData.updatedAt,
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
    console.error('Budget API Error:', {
      message: error.message,
      stack: error.stack,
    });
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
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');

    const requestBody = await request.json();
    console.log('Budget creation data:', {
      hasAmount: !!requestBody.amount,
      amount: requestBody.amount,
    });

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Creating budget at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend budget creation error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    // 백엔드 응답 구조 확인을 위한 로그
    console.log('Raw backend response:', JSON.stringify(data, null, 2));

    // 응답 데이터 구조 검증 및 변환
    const createdBudget = {
      ...data,
      id: data.id || data._id,
      createdAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: createdBudget,
        message: '예산이 성공적으로 생성되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget',
        meta: {
          createdAt: createdBudget.createdAt,
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Budget Creation API Error:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: '예산 설정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/budget',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
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
