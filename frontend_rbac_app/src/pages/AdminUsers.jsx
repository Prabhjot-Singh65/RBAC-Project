import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function AdminUsers() {
  const { user } = useAuth()
  const token = user?.token
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = async () => {
    try {
      const data = await api('/admin/users', 'GET', null, token)
      setUsers(data.users)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateRole = async (userId, newRole) => {
    setSavingId(userId)
    try {
      await api(`/admin/users/${userId}/role`, 'PATCH', { role: newRole }, token)
      await load() // refresh
      alert('Role updated!')
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin - Manage User Roles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.map((u) => (
        <div
          key={u._id}
          style={{
            border: '1px solid #ccc',
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
          }}
        >
          <b>{u.email}</b> — {u.name}
          <br />

          {/* Role Dropdown */}
          <select
            value={u.role}
            disabled={savingId === u._id}
            onChange={(e) => updateRole(u._id, e.target.value)}
            style={{ marginTop: 10 }}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          {savingId === u._id && <span> Updating...</span>}
        </div>
      ))}
    </div>
  )
}
