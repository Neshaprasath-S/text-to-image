import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from 'framer-motion'

const Steps = () => {
  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center my-5 py-4"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="display-6 fw-bold mb-2 text-center">
        How it works
      </h2>
      <p className="text-secondary fs-5 mb-4 text-center">
        Transform Words Into Stunning Images
      </p>

      <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: '750px' }}>
        {stepsData.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-4 p-4 bg-white rounded-3 shadow-sm border hover-scale"
            style={{ cursor: 'pointer' }}
          >
            <img style={{ width: '42px' }} src={item.icon} alt="" />
            <div>
              <h3 className="h5 fw-semibold mb-1">{item.title}</h3>
              <p className="text-secondary small mb-0">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Steps