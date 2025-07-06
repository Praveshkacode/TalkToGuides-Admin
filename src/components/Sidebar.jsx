import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ExpertContext } from '../context/ExpertContext'

const Sidebar = () => {
    const {aToken} = useContext(AdminContext)
    const {eToken} = useContext(ExpertContext)
  return (
    <div className='min-h-screen bg-white border-r'>
        {
            aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/admin-dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-sessions'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Sessions</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-expert'}>
                    <img src={assets.add_icon} alt="" />
                    <p>Add Expert</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-list'}>
                    <img src={assets.people_icon} alt="" />
                    <p>Expert List</p>
                </NavLink>
            </ul>
        }
        {
            eToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-sessions'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Sessions</p>
                </NavLink>
                
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/expert-profile'}>
                    <img src={assets.people_icon} alt="" />
                    <p>Profile</p>
                </NavLink>
            </ul>
        }
      
    </div>
  )
}

export default Sidebar
