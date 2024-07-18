import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signinFailure, signinStart, signinSuccess } from '../redux/user/userSlice.js'
import 'react-toastify/dist/ReactToastify.css'
import OAuth from '../components/OAuth.jsx'

const Signin = () => {
  const { loading } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Frontend validation
    const { email, password } = formData
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    dispatch(signinStart())
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        dispatch(signinSuccess(data))
        toast.success('Sign in successful!')
        navigate('/')
      } else {
        dispatch(signinFailure(data.message))
        toast.error(data.message || 'Sign in failed!')
      }
    } catch (error) {
      dispatch(signinFailure(error.message))
      toast.error('An error occurred!')
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto shadow-sm'>
      <h2 className='text-3xl text-center font-semibold my-5'>Sign In</h2>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='Email..' className='border p-3 rounded-lg focus:outline-none' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password..' className='border p-3 rounded-lg focus:outline-none' id='password' onChange={handleChange} />
        <button type='submit' className='uppercase font-bold bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80' disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
        <div className='text-center my-3 '>
          <p>Don't have an account? 
            <Link to={'/sign-up'} className='text-blue-700'>Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Signin
//lec#10