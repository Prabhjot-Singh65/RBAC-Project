import PostDetails from './pages/PostDetails'
import EditPost from './pages/EditPost'
import CreatePost from './pages/CreatePost'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import AdminUsers from './pages/AdminUsers'
import { RequireAuth } from './components/RequireAuth'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/posts">Posts</Link> |{" "}
        {/* Create link for editor/admin */}
        {(user?.user?.role === 'admin' || user?.user?.role === 'editor') && (
          <>
            <Link to="/posts/create">Create</Link> |{" "}
          </>
        )}
        {user?.user?.role === 'admin' && <Link to="/admin/users">Admin</Link>} |{" "}
        {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
      </nav>


      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/posts' element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route element={<RequireAuth roles={['admin']} />}>
          <Route path='/admin/users' element={<AdminUsers />} />
        </Route>
        <Route element={<RequireAuth roles={['admin', 'editor']} />}>
          <Route path="/posts/create" element={<CreatePost />} />
        </Route>
        <Route element={<RequireAuth roles={['admin', 'editor']} />}>
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Route>
      </Routes>
    </div>
  )
}
