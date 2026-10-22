import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const GenerateBtn = () => {

    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = () => {
        if (user) {
            navigate('/result')
            window.scrollTo(0, 0)
        } else {
            window.scrollTo(0, 0)
            setShowLogin(true)
        }
    }

    return (
        <motion.div
            className='pb-5 text-center my-4'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className='display-6 fw-bold text-dark my-4 py-2'>See the magic. Try now</h2>

            <button
                onClick={onClickHandler}
                className='btn btn-dark-pill px-5 py-3 d-inline-flex align-items-center gap-2 shadow hover-scale'
            >
                Generate Images <img style={{ height: '22px' }} src={assets.star_group} alt="" />
            </button>
        </motion.div>
    )
}

export default GenerateBtn