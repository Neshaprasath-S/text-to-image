import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Verify = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const transactionId = searchParams.get("transactionId")

    const { backendUrl, loadCreditsData, token } = useContext(AppContext)
    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/verify-stripe",
                { success, transactionId },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                loadCreditsData()
            } else {
                toast.error(data.message)
            }

            navigate("/")
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className='d-flex align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Verify