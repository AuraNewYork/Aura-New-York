const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export async function verifyLogin(email: string, password: string) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/site-verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(err.error || 'Login failed')
  }
  return res.json() as Promise<{ token: string; role: string; full_name: string }>
}

export async function adminWrite(
  token: string,
  action: 'insert' | 'update' | 'delete' | 'upload-url',
  table: string,
  data: Record<string, unknown>,
  id?: string
) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/site-admin-write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, table, data, id }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export async function sendEmail(payload: {
  type: string
  name: string
  email: string
  phone?: string
  message: string
  building?: string
  unit?: string
}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/site-send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Send failed' }))
    throw new Error(err.error || 'Send failed')
  }
  return res.json()
}

export async function getUploadUrl(token: string, filename: string) {
  return adminWrite(token, 'upload-url', 'storage', { filename })
}
