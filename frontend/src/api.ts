const API_URL = 'http://localhost:8080'

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`)
  return res.json()
}

export async function createTask(title: string) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  return res.json()
}

export async function updateTask(
  id: number,
  data: { title?: string; status?: string }
) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return res.json()
}

export async function deleteTask(id: number) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
}
