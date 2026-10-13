// Drawing the page: cards, details, form values, and messages.

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let alertTimer = null;

// type: 'success' or 'danger'
function showAlert(type, message) {
  const area = document.getElementById('alertArea');
  area.innerHTML =
    '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
    escapeHtml(message) +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => { area.innerHTML = ''; }, 5000);
}

function statusBadge(status) {
  const cls = status === 'Open' ? 'bg-success' : 'bg-secondary';
  return '<span class="badge ' + cls + '">' + escapeHtml(status) + '</span>';
}

function renderList(opportunities) {
  const container = document.getElementById('opportunityList');

  if (opportunities.length === 0) {
    container.innerHTML =
      '<div class="col-12"><div class="alert alert-info mb-0">No research opportunities found.</div></div>';
    return;
  }

  container.innerHTML = opportunities.map((o) => {
    const closeBtn = o.status === 'Open'
      ? '<button class="btn btn-outline-warning btn-sm" data-action="close" data-id="' + o.id + '">Close</button>'
      : '';
    return (
      '<div class="col-md-6 col-lg-4">' +
        '<div class="card opportunity-card h-100">' +
          '<div class="card-body">' +
            '<div class="d-flex justify-content-between align-items-start mb-2">' +
              '<h5 class="card-title mb-0 me-2">' + escapeHtml(o.title) + '</h5>' +
              statusBadge(o.status) +
            '</div>' +
            '<div class="meta-line"><span class="meta-label">Area:</span> ' + escapeHtml(o.research_area) + '</div>' +
            '<div class="meta-line"><span class="meta-label">Faculty:</span> ' + escapeHtml(o.faculty_name) + '</div>' +
            '<div class="meta-line"><span class="meta-label">Department:</span> ' + escapeHtml(o.department) + '</div>' +
            '<div class="meta-line"><span class="meta-label">Positions:</span> ' + escapeHtml(o.available_positions) + '</div>' +
            '<div class="meta-line"><span class="meta-label">Deadline:</span> ' + escapeHtml(o.application_deadline) + '</div>' +
          '</div>' +
          '<div class="card-footer bg-white d-flex flex-wrap gap-2">' +
            '<button class="btn btn-outline-primary btn-sm" data-action="view" data-id="' + o.id + '">View</button>' +
            '<button class="btn btn-outline-secondary btn-sm" data-action="edit" data-id="' + o.id + '">Edit</button>' +
            closeBtn +
            '<button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="' + o.id + '" data-title="' + escapeHtml(o.title) + '">Delete</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function renderDetails(o) {
  const rows = [
    ['ID', o.id],
    ['Research title', o.title],
    ['Research description', o.description],
    ['Research area', o.research_area],
    ["Faculty member's name", o.faculty_name],
    ['Department', o.department],
    ['Required skills', o.required_skills],
    ['Available positions', o.available_positions],
    ['Application deadline', o.application_deadline],
  ];
  document.getElementById('detailsBody').innerHTML =
    rows.map((r) =>
      '<div class="detail-row"><div class="detail-label">' + escapeHtml(r[0]) +
      '</div><div class="detail-value">' + escapeHtml(r[1]) + '</div></div>'
    ).join('') +
    '<div class="detail-row"><div class="detail-label">Status</div><div class="detail-value">' +
    statusBadge(o.status) + '</div></div>';
}

// Message shown inside the form (visible even when the page behind is covered)
function showFormAlert(message) {
  document.getElementById('formAlert').innerHTML =
    '<div class="alert alert-danger py-2" role="alert">' + escapeHtml(message) + '</div>';
  document.getElementById('formAlert').scrollIntoView({ block: 'nearest' });
}

function clearFormAlert() {
  document.getElementById('formAlert').innerHTML = '';
}

function clearFieldErrors() {
  clearFormAlert();
  FORM_FIELDS.forEach((f) => {
    const input = document.getElementById(f);
    input.classList.remove('is-invalid');
    const fb = input.parentElement.querySelector('.invalid-feedback');
    if (fb) fb.textContent = '';
  });
}

function showFieldErrors(errors) {
  Object.keys(errors).forEach((f) => {
    const input = document.getElementById(f);
    input.classList.add('is-invalid');
    const fb = input.parentElement.querySelector('.invalid-feedback');
    if (fb) fb.textContent = errors[f];
  });
}

function getFormValues() {
  const values = {};
  FORM_FIELDS.forEach((f) => { values[f] = document.getElementById(f).value; });
  return values;
}

// opportunity = null for a new one, or an object when editing
function fillForm(opportunity) {
  clearFieldErrors();
  document.getElementById('opportunityId').value = opportunity ? opportunity.id : '';
  document.getElementById('formTitle').textContent = opportunity ? 'Edit Opportunity' : 'Add Opportunity';
  FORM_FIELDS.forEach((f) => {
    document.getElementById(f).value = opportunity ? opportunity[f] : (f === 'status' ? 'Open' : '');
  });
}

