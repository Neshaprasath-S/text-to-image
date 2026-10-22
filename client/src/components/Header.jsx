import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = () => {
        if (user) {
            navigate('/result')
        } else {
            setShowLogin(true)
        }
    }

    return (
        <motion.div
            className='d-flex flex-column justify-content-center align-items-center text-center my-5 py-4'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <motion.div
                className='d-inline-flex align-items-center gap-2 bg-white px-4 py-1 rounded-pill border border-secondary-subtle text-secondary shadow-sm'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <p className='mb-0 small'>Best text to image generator</p>
                <img src={assets.star_icon} alt="" />
            </motion.div>

            <motion.h1
                className='display-4 fw-bold mx-auto mt-4'
                style={{ maxWidth: '650px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 2 }}
            >
                Turn text to <span className='text-primary'>image</span>, in seconds.
            </motion.h1>

            <motion.p
                className='text-secondary mx-auto mt-3 fs-5'
                style={{ maxWidth: '580px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.
            </motion.p>

            <motion.button
                className='btn btn-dark-pill px-5 py-3 mt-4 d-inline-flex align-items-center gap-2 shadow'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
                onClick={onClickHandler}
            >
                Generate Images <img style={{ height: '22px' }} src={assets.star_group} alt="" />
            </motion.button>

            <motion.div
                className='d-flex flex-wrap justify-content-center mt-5 gap-2 gap-sm-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                {Array(6).fill('').map((item, index) => (
                    <motion.img
                        className='rounded-3 shadow-sm hover-scale'
                        style={{ width: '65px', cursor: 'pointer' }}
                        key={index}
                        src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
                        whileHover={{ scale: 1.08 }}
                    />
                ))}
            </motion.div>

            <motion.p
                className='mt-3 text-secondary small'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                Generated images from imagify
            </motion.p>
        </motion.div>
    )
}

export default Header