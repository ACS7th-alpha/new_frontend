export async function GET(request) {
  try {
    // 요청에서 Authorization 헤더 가져오기
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`;
    console.log('Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching spending data:', error);
    return Response.json(
      { error: 'Failed to fetch spending data', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`;
    console.log('Posting spending to:', url);
    console.log('Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error creating spending:', error);
    return Response.json(
      { error: 'Failed to create spending', details: error.message },
      { status: 500 }
    );
  }
}
