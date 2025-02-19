export async function POST(request) {
  try {
    const data = await request.json();
    const accessToken = request.headers.get('Authorization');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_CHAT_URL}/perplexity/ask`,
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
      { error: 'Chat request failed', details: error.message },
      { status: 500 }
    );
  }
}
