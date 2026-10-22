import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='d-flex align-items-center justify-content-between gap-3 py-4 mt-5 border-top border-secondary-subtle'>
        <img style={{ width: '130px' }} src={assets.logo} alt="Imagify" />
        <p className='text-secondary small mb-0 ps-3 border-start border-secondary-subtle flex-grow-1 d-none d-sm-block'>
            Copyright @GreatStack.dev | All right reserved.
        </p>
        <div className='d-flex gap-2'>
            <img style={{ width: '30px', cursor: 'pointer' }} src={assets.facebook_icon} alt="Facebook" />
            <img style={{ width: '30px', cursor: 'pointer' }} src={assets.twitter_icon} alt="Twitter" />
            <img style={{ width: '30px', cursor: 'pointer' }} src={assets.instagram_icon} alt="Instagram" />
        </div>
    </div>
  )
}

export default Footer