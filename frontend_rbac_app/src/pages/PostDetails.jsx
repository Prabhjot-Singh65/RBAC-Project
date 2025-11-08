import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function PostDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const token = user?.token
  const role = user?.user?.role
  const userId = user?.user?.id

  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // pass token if logged in so backend can apply role-aware visibility
        const data = await api(`/posts/${id}`, 'GET', null, token)
        setPost(data.post || data) // controller returns { post }, list returned { items }; we handle both
      } catch (err) {
        setError(err.message || 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const isOwner = post && post.authorId === userId
  const canEdit = role === 'admin' || (role === 'editor' && isOwner)
  const canDelete = role === 'admin'

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await api(`/posts/${id}`, 'DELETE', null, token)
      nav('/posts')
    } catch (err) {
      alert(err.message || 'Delete failed')
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h3 style={{ color: 'red' }}>{error}</h3>
        <Link to="/posts">Back to Posts</Link>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <p>Post not found or you do not have permission.</p>
        <Link to="/posts">Back to Posts</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>
        <div><b>Author:</b> {post.authorId}</div>
        {typeof post.published === 'boolean' && (
          <div><b>Status:</b> {post.published ? 'Published' : 'Draft'}</div>
        )}
        {post.createdAt && <div><b>Created:</b> {new Date(post.createdAt).toLocaleString()}</div>}
        {post.updatedAt && <div><b>Updated:</b> {new Date(post.updatedAt).toLocaleString()}</div>}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/posts"><button>Back</button></Link>
        {' '}
        {canEdit && (
          <Link to={`/posts/${post._id}/edit`}>
            <button>Edit</button>
          </Link>
        )}
        {' '}
        {canDelete && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  )
}
