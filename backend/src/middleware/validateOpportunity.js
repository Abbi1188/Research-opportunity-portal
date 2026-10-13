// Input validation for the opportunities API. Failed checks return 400 Bad Request.

const TEXT_FIELDS = {
  title: { label: 'Title', max: 255 },
  description: { label: 'Description', max: 65000 },
  research_area: { label: 'Research area', max: 150 },
  faculty_name: { label: 'Faculty name', max: 150 },
  department: { label: 'Department', max: 150 },
  required_skills: { label: 'Required skills', max: 500 },
};

const ALL_FIELDS = [
  'title', 'description', 'research_area', 'faculty_name', 'department',
  'required_skills', 'available_positions', 'application_deadline', 'status',
];

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Returns an error message (string) or null. Only checks fields that are present
// when partial = true (update); checks every required field when partial = false (create).
function checkBody(body, partial) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  if (partial && !ALL_FIELDS.some((f) => body[f] !== undefined)) {
    return 'Provide at least one field to update';
  }

  for (const [field, { label, max }] of Object.entries(TEXT_FIELDS)) {
    const value = body[field];
    if (value === undefined) {
      if (!partial) return `${label} is required`;
      continue;
    }
    if (typeof value !== 'string' || value.trim() === '') return `${label} is required`;
    if (value.trim().length > max) return `${label} must be at most ${max} characters`;
  }

  const pos = body.available_positions;
  if (pos === undefined) {
    if (!partial) return 'Available positions is required';
  } else {
    const n = typeof pos === 'string' ? (pos.trim() === '' ? NaN : Number(pos)) : pos;
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > 2147483647) {
      return 'Available positions must be a whole number of 1 or more';
    }
  }

  const deadline = body.application_deadline;
  if (deadline === undefined) {
    if (!partial) return 'Application deadline is required';
  } else if (!isValidDate(deadline)) {
    return 'Application deadline must be a valid date in YYYY-MM-DD format';
  }

  if (body.status !== undefined && body.status !== 'Open' && body.status !== 'Closed') {
    return 'Status must be either Open or Closed';
  }

  return null;
}

function validateCreate(req, res, next) {
  const error = checkBody(req.body, false);
  if (error) return res.status(400).json({ error });
  next();
}

function validateUpdate(req, res, next) {
  const error = checkBody(req.body, true);
  if (error) return res.status(400).json({ error });
  next();
}

function validateId(req, res, next) {
  if (!/^[1-9]\d{0,9}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID must be a positive whole number' });
  }
  next();
}

module.exports = { validateCreate, validateUpdate, validateId, ALL_FIELDS };
