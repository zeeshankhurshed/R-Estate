import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'
const Signup = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Frontend validation
    const { username, email, password } = formData
    if (!username || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Signup successful!')
        navigate('/sign-in');
      } else {
        toast.error(data.message || 'Signup failed!')
      }
    } catch (error) {
      toast.error('An error occurred!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto shadow-sm'>
      <h2 className='text-3xl text-center font-semibold my-5'>Sign Up</h2>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='UserName..' className='border p-3 rounded-lg focus:outline-none' id='username' onChange={handleChange} />
        <input type="email" placeholder='Email..' className='border p-3 rounded-lg focus:outline-none' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password..' className='border p-3 rounded-lg focus:outline-none' id='password' onChange={handleChange} />
        <button type='submit' className='uppercase font-bold bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80' disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth/>
        <div className='text-center my-3 '>
          <p>Have an account? 
            <Link to={'/sign-in'} className='text-blue-700'>Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Signup
