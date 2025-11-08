import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function CreatePost() {
  const { user } = useAuth()
  const token = user?.token
  const nav = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api('/posts', 'POST', { title, content, published }, token)
      nav('/posts')
    } catch (err) {
      setError(err.message || 'Failed to create post')
    } finally {
      setSaving(false)
    }
  }

  const role = user?.user?.role
  const canCreate = role === 'admin' || role === 'editor'

  if (!canCreate) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Create Post</h2>
        <p>You do not have permission to create posts.</p>
        <Link to="/posts">Back to Posts</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit}>
        <div>
          <label>Title</label><br />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your post title"
            required
            style={{ width: '100%', maxWidth: 500 }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Content</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            required
            rows={6}
            style={{ width: '100%', maxWidth: 500 }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />{' '}
            Published
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <button disabled={saving}>{saving ? 'Saving...' : 'Create Post'}</button>{' '}
          <Link to="/posts">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
