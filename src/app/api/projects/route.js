import { pool } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    let query = 'SELECT * FROM Project';
    const params = [];
    if (id) {
      query += ' WHERE Id = ?';
      params.push(id);
    }
    const [rows] = await pool.query(query, params);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response('Server Error', { status: 500, headers: corsHeaders });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received project data:', data);
    const { Name, Email, Phone, Company, Project_type, Notes, Due_date, Status, Progress } = data;

    // Check if client exists
    const [existingClients] = await pool.query('SELECT Id FROM Client WHERE Email = ?', [Email]);
    let clientId;
    if (existingClients.length > 0) {
      clientId = existingClients[0].Id;
    } else {
      // Insert new client
      const clientInsertQuery = `
        INSERT INTO Client (Name, Email, Phone, Company, Notes, Created_at, Updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const clientResult = await pool.query(clientInsertQuery, [Name, Email, Phone || '', Company || '', Notes || '']);
      clientId = clientResult[0].insertId;
    }

    // Insert project linked to client
    const projectInsertQuery = `
      INSERT INTO Project (Name, Description, Client_id, Project_type, Start_date, Due_date, Completion_Date, Status, Priority, Progress, Current_stage, Notes, Created_at, Updated_at, Created_by)
      VALUES (?, ?, ?, ?, NOW(), ?, NULL, ?, 'Standard', ?, NULL, ?, NOW(), NOW(), NULL)
    `;
    await pool.query(projectInsertQuery, [Name, '', clientId, Project_type, Due_date || null, Status || 'briefed', Progress || 0, Notes || '']);

    return new Response(JSON.stringify({ message: 'Project and client added successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error('Error inserting project and client:', err.message || err);
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ message: 'Project ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    const deleteResult = await pool.query('DELETE FROM Project WHERE Id = ?', [id]);
    if (deleteResult[0].affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Project not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error('Error deleting project:', err.message || err);
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, Progress, Current_stage, Status, Notes } = data;

    if (!id) {
      return new Response(JSON.stringify({ message: 'Project ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fields = [];
    const values = [];

    if (Progress !== undefined) {
      fields.push('Progress = ?');
      values.push(Progress);
    }
    if (Current_stage !== undefined) {
      fields.push('Current_stage = ?');
      values.push(Current_stage);
    }
    if (Status !== undefined) {
      fields.push('Status = ?');
      values.push(Status);
    }
    if (Notes !== undefined) {
      fields.push('Notes = ?');
      values.push(Notes);
    }

    if (fields.length === 0) {
      return new Response(JSON.stringify({ message: 'No fields to update' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    values.push(id);

    const query = `UPDATE Project SET ${fields.join(', ')}, Updated_at = NOW() WHERE Id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Project not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Project updated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error('Error updating project:', err.message || err);
    return new Response(JSON.stringify({ message: err.message || 'Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};
