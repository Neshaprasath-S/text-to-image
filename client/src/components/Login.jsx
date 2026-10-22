import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Login = () => {

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { backendUrl, setShowLogin, setToken, setUser } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className='login-modal-overlay'>
            <motion.form
                onSubmit={onSubmitHandler}
                className='login-modal-box'
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <img
                    onClick={() => setShowLogin(false)}
                    className='position-absolute top-0 end-0 m-3'
                    style={{ cursor: 'pointer', width: '14px' }}
                    src={assets.cross_icon}
                    alt="Close"
                />

                <h2 className='h4 text-center fw-bold mb-1'>{state}</h2>
                <p className='text-secondary text-center small mb-4'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && (
                    <div className='input-with-icon mb-3'>
                        <img style={{ width: '16px' }} src={assets.email_icon} alt="" />
                        <input
                            onChange={e => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder='Full Name'
                            required
                        />
                    </div>
                )}

                <div className='input-with-icon mb-3'>
                    <img style={{ width: '16px' }} src={assets.email_icon} alt="" />
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder='Email id'
                        required
                    />
                </div>

                <div className='input-with-icon mb-3'>
                    <img style={{ width: '16px' }} src={assets.lock_icon} alt="" />
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder='Password'
                        required
                    />
                </div>

                <p className='small text-primary my-3' style={{ cursor: 'pointer' }}>Forgot password?</p>

                <button type='submit' className='btn btn-primary w-100 rounded-pill py-2 fw-medium'>
                    {state === 'Login' ? 'Login' : 'Create Account'}
                </button>

                {state === "Login" ? (
                    <p className='mt-4 mb-0 text-center small text-secondary'>
                        Don't have an account?{' '}
                        <span onClick={() => setState('Sign Up')} className='text-primary fw-medium' style={{ cursor: 'pointer' }}>
                            Sign up
                        </span>
                    </p>
                ) : (
                    <p className='mt-4 mb-0 text-center small text-secondary'>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-primary fw-medium' style={{ cursor: 'pointer' }}>
                            Login
                        </span>
                    </p>
                )}
            </motion.form>
        </div>
    )
}

export default Login