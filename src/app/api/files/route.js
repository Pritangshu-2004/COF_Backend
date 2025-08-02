import { pool } from '../../../lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Setup multer storage
const uploadDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request) {
  const projectId = request.nextUrl.searchParams.get('projectId');
  if (!projectId) {
    return new Response(JSON.stringify({ message: 'Project ID is required' }), { status: 400, headers: corsHeaders });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM File WHERE Project_id = ?', [projectId]);
    return new Response(JSON.stringify(rows), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), { status: 500, headers: corsHeaders });
  }
}

// Helper to parse multipart form data using multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(request) {
  // Since Next.js API routes do not expose req/res directly in this setup,
  // we need to handle file uploads differently.
  // For now, we will fallback to JSON upload as before.
  // Full multipart handling requires custom server or middleware support.

  // Fallback to previous JSON handling:
  const data = await request.json();
  const { projectId, name, link, note, type } = data;
  if (!projectId || !name) {
    return new Response(JSON.stringify({ message: 'Project ID and name are required' }), { status: 400, headers: corsHeaders });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO File (Project_id, Name, URL_Link, Notes, Type, Uploaded_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [projectId, name, link || '', note || '', type || 'file']
    );
    return new Response(JSON.stringify({ id: result.insertId }), { status: 201, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ message: 'File ID is required' }), { status: 400, headers: corsHeaders });
  }
  try {
    const [result] = await pool.query('DELETE FROM File WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'File not found' }), { status: 404, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ message: 'File deleted successfully' }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), { status: 500, headers: corsHeaders });
  }
}
