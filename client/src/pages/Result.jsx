import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const Result = () => {

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [image, setImage] = useState(assets.sample_img_1)

  const { generateImage } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (input) {
      const generatedImg = await generateImage(input)
      if (generatedImg) {
        setIsImageLoaded(true)
        setImage(generatedImg)
      }
    }
    setLoading(false)
  }

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className='d-flex flex-column justify-content-center align-items-center py-5'
      style={{ minHeight: '85vh' }}
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='text-center'>
        <div className='position-relative d-inline-block shadow-sm rounded-4 overflow-hidden'>
          <img
            className='img-fluid rounded-4'
            style={{ maxWidth: '380px' }}
            src={image}
            alt="Generated Result"
          />
          <span
            className='position-absolute bottom-0 start-0 bg-primary'
            style={{
              height: '4px',
              width: loading ? '100%' : '0%',
              transition: loading ? 'width 10s ease-in-out' : 'none'
            }}
          />
        </div>
        {loading && <p className='mt-2 text-secondary small'>Generating image...</p>}
      </div>

      {!isImageLoaded && (
        <div className='prompt-search-bar mt-4 shadow-sm'>
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Describe what you want to generate'
          />
          <button type='submit' className='btn btn-dark rounded-pill px-4 px-sm-5 py-2 fw-medium'>
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className='d-flex gap-2 flex-wrap justify-content-center mt-4'>
          <button
            type='button'
            onClick={() => setIsImageLoaded(false)}
            className='btn btn-outline-dark rounded-pill px-4 py-2 hover-scale-sm'
          >
            Generate Another
          </button>
          <a
            href={image}
            download
            className='btn btn-dark rounded-pill px-4 py-2 hover-scale-sm text-white text-decoration-none'
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  )
}

export default Result