
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const data = await api('/auth/login','POST',{ email, password })
      login({ token: data.token, user: data.user })
      nav('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={submit}>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button>Login</button>
      </form>
    </div>
  )
}
