import { pool } from '../../../lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  if (!projectId) {
    return new Response(JSON.stringify({ message: 'Project ID is required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM Communication WHERE Project_id = ?', [projectId]);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function POST(request) {
  const data = await request.json();
  const { projectId, type, note, date } = data;
  if (!projectId || !type || !note) {
    return new Response(JSON.stringify({ message: 'Project ID, type, and note are required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  try {
    // Convert date string to MySQL datetime format (YYYY-MM-DD HH:mm:ss)
    let formattedDate = date ? new Date(date) : new Date();
    if (isNaN(formattedDate.getTime())) {
      formattedDate = new Date();
    }
    const mysqlDate = formattedDate.toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.query(
      'INSERT INTO Communication (Project_id, Type, Notes, Date) VALUES (?, ?, ?, ?)',
      [projectId, type, note, mysqlDate]
    );
    return new Response(JSON.stringify({ id: result.insertId }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Error in POST /api/communications:', err);
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ message: 'Communication ID is required' }), { status: 400, headers: corsHeaders });
  }
  try {
    const [result] = await pool.query('DELETE FROM Communication WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Communication not found' }), { status: 404, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ message: 'Communication deleted successfully' }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), { status: 500, headers: corsHeaders });
  }
}
