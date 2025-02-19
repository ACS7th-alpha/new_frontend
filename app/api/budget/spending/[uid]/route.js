export async function PUT(request, { params }) {
  try {
    console.log('Spending update request received');
    const { uid } = params;
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error('Missing Authorization header in spending update request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: `/api/budget/spending/${uid}`,
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
    const requestBody = await request.json();
    if (
      !requestBody ||
      !requestBody.date ||
      !requestBody.category ||
      !requestBody.amount
    ) {
      console.error('Invalid update data:', requestBody);
      return new Response(
        JSON.stringify({
          error: 'Invalid update data. Required fields: date, category, amount',
          timestamp: new Date().toISOString(),
          path: `/api/budget/spending/${uid}`,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log('Update data received for spending ID:', uid);
    console.log('Update data:', requestBody);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending/${uid}`;
    console.log('Updating spending at:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend spending update error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log('Spending successfully updated');

    return new Response(
      JSON.stringify({
        success: true,
        message: '지출이 성공적으로 수정되었습니다.',
        timestamp: new Date().toISOString(),
        path: `/api/budget/spending/${uid}`,
        data: {
          id: uid,
          ...requestBody,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating spending:', error);
    return new Response(
      JSON.stringify({
        error: '지출 수정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: `/api/budget/spending/${uid}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log('Spending deletion request received');
    const { uid } = params;
    const authorization = request.headers.get('Authorization');

    // Authorization 헤더 검증
    if (!authorization) {
      console.error(
        'Missing Authorization header in spending deletion request'
      );
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: `/api/budget/spending/${uid}`,
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
    console.log('Attempting to delete spending with ID:', uid);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BUDGET_URL}/budget/spending/${uid}`;
    console.log('Deleting spending at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend spending deletion error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log('Spending successfully deleted');

    // 성공적인 삭제 응답
    return new Response(
      JSON.stringify({
        success: true,
        message: '지출이 성공적으로 삭제되었습니다.',
        deletedId: uid,
        timestamp: new Date().toISOString(),
        path: `/api/budget/spending/${uid}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting spending:', error);
    return new Response(
      JSON.stringify({
        error: '지출 삭제에 실패했습니다.',
        details: error.message,
        spendingId: uid,
        timestamp: new Date().toISOString(),
        path: `/api/budget/spending/${uid}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
