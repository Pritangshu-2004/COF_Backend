export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt:', username, password);

    // Array of allowed users
    const users = [
      { username: 'yashwijain', password: 'Sequoiayashwi123!', name: 'Yashwi Jain', email: 'yashwi@example.com', role: 'User' },
      { username: 'meetjain', password: 'Sequoiameet789!', name: 'Meet Jain', email: 'meet@example.com', role: 'User' },
      { username: 'nishajain', password: 'Sequoianisha567!', name: 'Nisha Jain', email: 'nisha@example.com', role: 'User' },
      { username: 'Pritangshu', password: 'pritangshu', name: 'Pritangshu', email: 'pritangshu@example.com', role: 'User' },
    ];

    // Find user (case-sensitive username)
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      return new Response(JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        token: 'fake-jwt-token'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response('Server Error', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
