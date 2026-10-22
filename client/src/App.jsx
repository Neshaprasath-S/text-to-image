import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import Verify from './pages/Verify'

const App = () => {

  const { showLogin } = useContext(AppContext)

  return (
    <div className='app-container'>
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='/buy' element={<BuyCredit />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App