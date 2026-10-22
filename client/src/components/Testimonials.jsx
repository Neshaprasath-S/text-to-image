import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'framer-motion'

const Testimonials = () => {
    return (
        <motion.div
            className="d-flex flex-column align-items-center justify-content-center my-5 py-4"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className="display-6 fw-bold mb-2 text-center">Customer testimonials</h2>
            <p className="text-secondary mb-5 text-center">What Our Users Are Saying</p>
            
            <div className="row justify-content-center g-4 w-100" style={{ maxWidth: '1050px' }}>
                {testimonialsData.map((testimonial, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 p-4 border border-secondary-subtle rounded-4 shadow-sm bg-white hover-scale text-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                            />
                            <h3 className="h6 fw-bold mb-0">{testimonial.name}</h3>
                            <p className="small text-secondary mb-3">{testimonial.role}</p>
                            <div className="d-flex justify-content-center gap-1 mb-3">
                                {Array(testimonial.stars).fill('').map((item, starIdx) => (
                                    <img key={starIdx} style={{ width: '16px' }} src={assets.rating_star} alt="" />
                                ))}
                            </div>
                            <p className="small text-secondary mb-0">{testimonial.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default Testimonials