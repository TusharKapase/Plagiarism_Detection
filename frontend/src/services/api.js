const API_URL = "http://localhost:5000/api";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
