export async function GET(request) {
  try {
    // 요청에서 Authorization 헤더 가져오기
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Fetching budget from:', url);

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
    console.error('Error fetching budget:', error);
    return Response.json(
      { error: 'Failed to fetch budget', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Posting budget to:', url);
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
    console.error('Error creating budget:', error);
    return Response.json(
      { error: 'Failed to create budget', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const authorization = request.headers.get('Authorization');

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget`;
    console.log('Deleting budget at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    console.error('Error deleting budget:', error);
    return Response.json(
      { error: 'Failed to delete budget', details: error.message },
      { status: 500 }
    );
  }
}
