import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { ExpertContext } from '../context/ExpertContext'

const Navbar = () => {

    const {aToken,setAToken} = useContext(AdminContext)
    const {eToken,setEToken} = useContext(ExpertContext)

    const navigate = useNavigate()

    const logout = ()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        eToken && setEToken('')
        eToken && localStorage.removeItem('eToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin':'Expert'}</p>
      </div>
      <button className='bg-primary text-white text-sm px-10 py-2 rounded-full' onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar
