// Connects the page, the API, validation, and the UI.

const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
const formModal = new bootstrap.Modal(document.getElementById('formModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

let deleteId = null;

// Load and display all opportunities
async function loadOpportunities() {
  try {
    const result = await api.getAll();
    renderList(result.data);
  } catch (err) {
    document.getElementById('opportunityList').innerHTML = '';
    showAlert('danger', 'Could not load opportunities. ' + err.message);
  }
}

// Navbar: open the empty form
document.getElementById('addBtn').addEventListener('click', () => {
  fillForm(null);
  formModal.show();
});

// Buttons on the cards (View, Edit, Close, Delete)
document.getElementById('opportunityList').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;

  try {
    if (button.dataset.action === 'view') {
      const result = await api.getOne(id);
      renderDetails(result.data);
      detailsModal.show();
    } else if (button.dataset.action === 'edit') {
      const result = await api.getOne(id);
      fillForm(result.data);
      formModal.show();
    } else if (button.dataset.action === 'close') {
      await api.update(id, { status: 'Closed' });
      showAlert('success', 'Opportunity closed successfully');
      await loadOpportunities();
    } else if (button.dataset.action === 'delete') {
      deleteId = id;
      document.getElementById('deleteName').textContent = button.dataset.title;
      deleteModal.show();
    }
  } catch (err) {
    showAlert('danger', err.message);
    loadOpportunities();
  }
});

// Create or update when the form is submitted
document.getElementById('opportunityForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  clearFieldErrors();

  const values = getFormValues();
  const errors = validateForm(values);
  if (Object.keys(errors).length > 0) {
    showFieldErrors(errors);
    showFormAlert('Please fix the highlighted fields: ' +
      Object.keys(errors).map((f) => FIELD_LABELS[f]).join(', ') + '.');
    const firstBad = document.getElementById(Object.keys(errors)[0]);
    firstBad.scrollIntoView({ block: 'center' });
    return;
  }

  const payload = {
    title: values.title.trim(),
    description: values.description.trim(),
    research_area: values.research_area.trim(),
    faculty_name: values.faculty_name.trim(),
    department: values.department.trim(),
    required_skills: values.required_skills.trim(),
    available_positions: Number(values.available_positions),
    application_deadline: values.application_deadline,
    status: values.status,
  };

  const id = document.getElementById('opportunityId').value;
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;

  try {
    if (id) {
      await api.update(id, payload);
      showAlert('success', 'Opportunity updated successfully');
    } else {
      await api.create(payload);
      showAlert('success', 'Opportunity created successfully');
    }
    formModal.hide();
    await loadOpportunities();
  } catch (err) {
    showFormAlert(err.message);
  } finally {
    saveBtn.disabled = false;
  }
});

// Confirm delete
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!deleteId) return;
  try {
    await api.remove(deleteId);
    showAlert('success', 'Opportunity deleted successfully');
  } catch (err) {
    showAlert('danger', err.message);
  } finally {
    deleteId = null;
    deleteModal.hide();
    loadOpportunities();
  }
});

// Start
loadOpportunities();

