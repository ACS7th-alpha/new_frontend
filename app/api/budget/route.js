export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch spending', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify(data),
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to create spending', details: error.message },
      { status: 500 }
    );
  }
}
