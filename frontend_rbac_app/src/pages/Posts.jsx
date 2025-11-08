import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function Posts() {
  const { user } = useAuth()
  const token = user?.token
  const role = user?.user?.role
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await api('/posts', 'GET', null, token)
      setPosts(data.items || [])
    } catch (err) { setError(err.message) }
  }

  useEffect(() => { load() }, [])

  const canCreate = role === 'admin' || role === 'editor'

  return (
    <div style={{ padding: 20 }}>
      <h2>Posts</h2>
      {canCreate && (
        <div style={{ marginBottom: 12 }}>
          <Link to="/posts/create"><button>Create Post</button></Link>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.map((p) => {
        const isOwner = p.authorId === user?.user?.id

        const canEdit =
          role === 'admin' ||
          (role === 'editor' && isOwner)

        const canDelete = role === 'admin' // ✅ ONLY ADMIN CAN DELETE

        const handleDelete = async () => {
          if (!confirm("Are you sure you want to delete this post?")) return
          try {
            await api(`/posts/${p._id}`, "DELETE", null, token)
            load() // refresh post list
          } catch (err) {
            alert(err.message)
          }
        }

        return (
          <div
            key={p._id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <h3>
              <Link to={`/posts/${p._id}`}>{p.title}</Link>
            </h3>

            <p>{p.content}</p>
            <small>Author: {p.authorId}</small>
            <br />

            {/* ✅ Edit Button */}
            {canEdit && (
              <Link to={`/posts/${p._id}/edit`}>
                <button style={{ marginTop: 8 }}>Edit</button>
              </Link>
            )}

            {/* ✅ Delete Button (ADMIN ONLY) */}
            {canDelete && (
              <button
                onClick={handleDelete}
                style={{ marginLeft: 8, marginTop: 8 }}
              >
                Delete
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
