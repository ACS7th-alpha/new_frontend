export async function GET(request) {
  try {
    const accessToken = request.headers.get('Authorization');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/auth/children`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch children', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('Child registration request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error(
        'Missing Authorization header in child registration request'
      );
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    if (!requestBody.name) {
      return new Response(
        JSON.stringify({
          error: '아이의 이름은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/children`;
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
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '아이 정보가 성공적으로 등록되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error registering child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 등록에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('Child update request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in child update request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    if (!requestBody.name) {
      return new Response(
        JSON.stringify({
          error: '아이의 이름은 필수 입력 항목입니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/children`;
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
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '아이 정보가 성공적으로 수정되었습니다.',
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 정보 수정에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('Child deletion request received');
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      console.error('Missing Authorization header in child deletion request');
      return new Response(
        JSON.stringify({
          error: 'Authorization header is required',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    if (!name) {
      return new Response(
        JSON.stringify({
          error: '삭제할 아이의 이름이 필요합니다.',
          timestamp: new Date().toISOString(),
          path: '/api/children',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/children?name=${encodeURIComponent(name)}`;
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
        message: '아이 정보가 성공적으로 삭제되었습니다.',
        deletedName: name,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting child:', error);
    return new Response(
      JSON.stringify({
        error: '아이 정보 삭제에 실패했습니다.',
        details: error.message,
        timestamp: new Date().toISOString(),
        path: '/api/children',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
