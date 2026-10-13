// Basic validation of the form fields before sending them to the API.

const FORM_FIELDS = [
  'title', 'description', 'research_area', 'faculty_name', 'department',
  'required_skills', 'available_positions', 'application_deadline', 'status',
];

const FIELD_LABELS = {
  title: 'Research title',
  description: 'Research description',
  research_area: 'Research area',
  faculty_name: "Faculty member's name",
  department: 'Department',
  required_skills: 'Required skills',
  available_positions: 'Available positions',
  application_deadline: 'Application deadline',
  status: 'Status',
};

// Returns an object like { title: 'message', ... }. Empty object = valid.
function validateForm(values) {
  const errors = {};

  ['title', 'description', 'research_area', 'faculty_name', 'department', 'required_skills']
    .forEach((field) => {
      if (!values[field] || values[field].trim() === '') {
        errors[field] = FIELD_LABELS[field] + ' is required';
      }
    });

  const positions = values.available_positions;
  if (positions === '' || positions === undefined) {
    errors.available_positions = 'Available positions is required';
  } else if (!/^\d+$/.test(String(positions).trim()) || Number(positions) < 1) {
    errors.available_positions = 'Enter a whole number of 1 or more';
  }

  if (!values.application_deadline) {
    errors.application_deadline = 'Application deadline is required';
  }

  if (values.status !== 'Open' && values.status !== 'Closed') {
    errors.status = 'Status must be Open or Closed';
  }

  return errors;
}
