const pool = require('../config/db');
const { ALL_FIELDS } = require('../middleware/validateOpportunity');

const COLUMNS =
  'id, title, description, research_area, faculty_name, department, required_skills, ' +
  'available_positions, application_deadline, status';

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

// Clean a value taken from the request body before saving it
function clean(field, value) {
  if (field === 'available_positions') return Number(value);
  if (typeof value === 'string') return value.trim();
  return value;
}

// 1. Create
async function createOpportunity(req, res) {
  try {
    const b = req.body;
    const [result] = await pool.execute(
      `INSERT INTO opportunities
        (title, description, research_area, faculty_name, department,
         required_skills, available_positions, application_deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clean('title', b.title),
        clean('description', b.description),
        clean('research_area', b.research_area),
        clean('faculty_name', b.faculty_name),
        clean('department', b.department),
        clean('required_skills', b.required_skills),
        clean('available_positions', b.available_positions),
        b.application_deadline,
        b.status || 'Open',
      ]
    );
    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM opportunities WHERE id = ?`,
      [result.insertId]
    );
    return res.status(201).json({ message: 'Opportunity created successfully', data: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// 2. Get all
async function getAllOpportunities(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM opportunities ORDER BY id DESC`
    );
    return res.status(200).json({ message: 'Opportunities retrieved successfully', data: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// 3. Get one
async function getOpportunity(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM opportunities WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Opportunity not found' });
    return res.status(200).json({ message: 'Opportunity retrieved successfully', data: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// 4. Update (any of the fields; fields not sent stay unchanged)
async function updateOpportunity(req, res) {
  try {
    const id = req.params.id;
    const [existing] = await pool.execute('SELECT id FROM opportunities WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Opportunity not found' });

    // Column names come from a fixed list, never from user input
    const sets = [];
    const values = [];
    for (const field of ALL_FIELDS) {
      if (req.body[field] !== undefined) {
        sets.push(`${field} = ?`);
        values.push(clean(field, req.body[field]));
      }
    }
    values.push(id);
    await pool.execute(`UPDATE opportunities SET ${sets.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM opportunities WHERE id = ?`,
      [id]
    );
    return res.status(200).json({ message: 'Opportunity updated successfully', data: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// 5. Delete
async function deleteOpportunity(req, res) {
  try {
    const [result] = await pool.execute('DELETE FROM opportunities WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Opportunity not found' });
    return res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
