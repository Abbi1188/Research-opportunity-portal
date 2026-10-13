const API_BASE = window.location.port === '5000'
  ? '/api/opportunities'
  : 'http://localhost:5000/api/opportunities';

async function request(method, url, body) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error('Cannot connect to the server');
  }

  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    // response had no JSON body
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong (status ' + response.status + ')');
  }
  return data;
}

const api = {
  getAll: () => request('GET', API_BASE),
  getOne: (id) => request('GET', API_BASE + '/' + id),
  create: (payload) => request('POST', API_BASE, payload),
  update: (id, payload) => request('PUT', API_BASE + '/' + id, payload),
  remove: (id) => request('DELETE', API_BASE + '/' + id),
};
