import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Description = () => {
    return (
        <motion.div
            className="d-flex flex-column align-items-center justify-content-center my-5 py-4"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}   
        >
            <h2 className="display-6 fw-bold mb-2 text-center">Create AI Images</h2>
            <p className="text-secondary mb-5 text-center">Turn your imagination into visuals</p>
            
            <div className="row align-items-center gy-4 gx-lg-5 w-100 justify-content-center" style={{ maxWidth: '960px' }}>
                <div className="col-12 col-md-5 text-center">
                    <img
                        src={assets.sample_img_1}
                        className="img-fluid rounded-4 shadow"
                        style={{ maxWidth: '340px' }}
                        alt="AI Sample"
                    />
                </div>
                <div className="col-12 col-md-7">
                    <h3 className="h4 fw-bold mb-3">Introducing the AI-Powered Text to Image Generator</h3>
                    <p className="text-secondary mb-3">
                        Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.
                    </p>
                    <p className="text-secondary mb-0">
                        Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don’t yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default Description