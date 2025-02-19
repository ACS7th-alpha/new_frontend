export async function DELETE(request, { params }) {
  try {
    const authorization = request.headers.get('Authorization');
    const { uid } = params;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_CART_URL}/cart/${uid}`;
    console.log('Deleting cart item at:', url);

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
    console.error('Error deleting cart item:', error);
    return Response.json(
      { error: 'Failed to delete cart item', details: error.message },
      { status: 500 }
    );
  }
}
