const API_URL = "http://localhost:5000/api"; 

export async function apiGet(endpoint, token) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: { "Authorization": token ? `Bearer ${token}` : undefined }
  });
  return res.json();
}

export async function apiPost(endpoint, data, token) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : undefined
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiPut(endpoint, data, token) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : undefined
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiDelete(endpoint, token) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "DELETE",
    headers: { "Authorization": token ? `Bearer ${token}` : undefined }
  });
  return res.json();
}