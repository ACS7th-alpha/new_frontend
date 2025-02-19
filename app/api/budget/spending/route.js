export async function GET(request) {
  try {
    console.log('Spending data fetch request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in spending fetch request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/budget/spending',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`;
    console.log('Fetching spending data from:', url);

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
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          spending: data.spending,
          totalAmount: Object.values(data.spending).reduce(
            (sum, amount) => sum + amount,
            0
          ),
          period: {
            year: data.year,
            month: data.month,
          },
        },
        message: '지출 데이터를 성공적으로 불러왔습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget/spending',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching spending data:', error);
    return new Response(
      JSON.stringify({
        error: '지출 데이터를 불러오는데 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/budget/spending',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    console.log('New expense creation request received');
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in expense creation request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/budget/spending',
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

    // 요청 본문 검증
    const requestData = await request.json();
    if (!requestData.amount || !requestData.category || !requestData.date) {
      console.error('Invalid expense data:', {
        hasAmount: !!requestData.amount,
        hasCategory: !!requestData.category,
        hasDate: !!requestData.date,
      });
      return new Response(
        JSON.stringify({
          error: '금액, 카테고리, 날짜는 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/budget/spending',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 금액 유효성 검사
    if (isNaN(requestData.amount) || requestData.amount <= 0) {
      console.error('Invalid amount:', requestData.amount);
      return new Response(
        JSON.stringify({
          error: '유효한 지출 금액을 입력해주세요.',
          timestamp: new Date().toISOString(),
          path: '/api/budget/spending',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`;
    console.log('Creating new expense at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend expense creation error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Expense successfully created');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        },
        message: '지출이 성공적으로 등록되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/budget/spending',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating expense:', error);
    return new Response(
      JSON.stringify({
        error: '지출 등록에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/budget/spending',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
