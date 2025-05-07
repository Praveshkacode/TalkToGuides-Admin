import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllSessions from './pages/Admin/AllSessions';
import AddExpert from './pages/Admin/AddExpert';
import ExpertList from './pages/Admin/ExpertList';

const App = () => {

  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-sessions' element={<AllSessions/>} />
          <Route path='/add-expert' element={<AddExpert/>} />
          <Route path='/expert-list' element={<ExpertList/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
          <Login/>
          <ToastContainer/>
    </>
  )
}

export default App
