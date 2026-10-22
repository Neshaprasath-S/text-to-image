import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

const BuyCredit = () => {

  const { backendUrl, loadCreditsData, user, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verify-razor', response, { headers: { token } })
          if (data.success) {
            loadCreditsData()
            navigate('/')
            toast.success('Credit Added')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
        return
      }

      const { data } = await axios.post(backendUrl + '/api/user/pay-razor', { planId }, { headers: { token } })
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const paymentStripe = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
        return
      }

      const { data } = await axios.post(backendUrl + '/api/user/pay-stripe', { planId }, { headers: { token } })
      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <motion.div
      className='min-vh-80 text-center pt-5 mb-5'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button className='btn btn-outline-secondary rounded-pill px-4 py-2 mb-3'>Our Plans</button>
      <h1 className='text-center display-6 fw-bold mb-4 mb-sm-5'>Choose the plan</h1>

      <div className='row justify-content-center g-4' style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {plans.map((item, index) => (
          <div className='col-12 col-md-6 col-lg-4' key={index}>
            <div className='card h-100 p-4 border border-secondary-subtle rounded-4 shadow-sm bg-white hover-scale text-start d-flex flex-column'>
              <img style={{ width: '38px' }} src={assets.logo_icon} alt="" />
              <h3 className='h5 fw-bold mt-3 mb-1'>{item.id}</h3>
              <p className='small text-secondary mb-3'>{item.desc}</p>
              <div className='my-3'>
                <span className='display-6 fw-bold'>₹{item.price}</span>
                <span className='text-secondary small'> / {item.credits} credits</span>
              </div>
              <div className='d-flex flex-column gap-2 mt-auto pt-3'>
                <button
                  onClick={() => paymentRazorpay(item.id)}
                  className='btn btn-light border border-secondary-subtle d-flex justify-content-center align-items-center py-2 hover-scale-sm'
                >
                  <img style={{ height: '18px' }} src={assets.razorpay_logo} alt="Razorpay" />
                </button>
                <button
                  onClick={() => paymentStripe(item.id)}
                  className='btn btn-light border border-secondary-subtle d-flex justify-content-center align-items-center py-2 hover-scale-sm'
                >
                  <img style={{ height: '18px' }} src={assets.stripe_logo} alt="Stripe" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit