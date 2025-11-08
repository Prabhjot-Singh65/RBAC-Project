import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function EditPost() {
  const { id } = useParams()
  const { user } = useAuth()
  const token = user?.token
  const role = user?.user?.role
  const userId = user?.user?.id

  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load post data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api(`/posts/${id}`, 'GET', null, token)
        setTitle(data.title)
        setContent(data.content)
        setPublished(data.published)

        const isOwner = data.authorId === userId
        const canEdit = role === 'admin' || (role === 'editor' && isOwner)

        if (!canEdit) {
          setError('You do not have permission to edit this post.')
        }
      } catch (err) {
        setError('Failed to load post.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api(`/posts/${id}`, 'PATCH', { title, content, published }, token)
      nav('/posts')
    } catch (err) {
      setError(err.message || 'Update failed.')
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  if (error)
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/posts">Back</Link>
      </div>
    )

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Post</h2>
      <form onSubmit={save}>
        <div>
          <label>Title</label><br />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', maxWidth: 500 }}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Content</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
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
          <button>Save Changes</button>{' '}
          <Link to="/posts">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
