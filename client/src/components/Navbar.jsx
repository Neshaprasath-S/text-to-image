import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const { setShowLogin, user, credit, logout } = useContext(AppContext)
    const navigate = useNavigate()

    return (
        <div className='d-flex align-items-center justify-content-between py-3'>

            <Link to='/'>
                <img style={{ width: '140px' }} src={assets.logo} alt="Imagify Logo" />
            </Link>

            <div>
                {
                    user
                        ? <div className='d-flex align-items-center gap-2 gap-sm-3'>
                            <button onClick={() => navigate('/buy')} className='btn btn-credit-pill d-flex align-items-center gap-2 px-3 px-sm-4 py-2 hover-scale-sm'>
                                <img style={{ width: '18px' }} src={assets.credit_star} alt="" />
                                <p className='small fw-medium text-secondary mb-0'>Credits left : {credit}</p>
                            </button>
                            <p className='text-secondary d-none d-sm-inline ps-2 mb-0'>Hi, {user.name}</p>
                            <div className='profile-dropdown-container'>
                                <img className='shadow-sm rounded-circle' style={{ width: '38px', cursor: 'pointer' }} src={assets.profile_icon} alt="User" />
                                <div className='profile-dropdown-menu'>
                                    <ul className='list-unstyled m-0 p-2 bg-white rounded-3 shadow-sm border small'>
                                        <li onClick={logout} className='py-1 px-3 text-danger' style={{ cursor: 'pointer' }}>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        : <div className='d-flex align-items-center gap-3 gap-sm-4'>
                            <p onClick={() => navigate('/buy')} className='mb-0 text-secondary fw-medium' style={{ cursor: 'pointer' }}>Pricing</p>
                            <button onClick={() => setShowLogin(true)} className='btn btn-dark-pill px-4 px-sm-5 py-2 small'>
                                Login
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar