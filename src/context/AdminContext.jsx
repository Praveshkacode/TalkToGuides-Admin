import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [experts,setExperts] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllExperts = async () => {
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-experts',{},{headers:{aToken}})
            if(data.success){
                setExperts(data.experts)
                console.log(data.experts);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (expId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{expId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllExperts()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAToken,backendUrl,experts,getAllExperts,changeAvailability
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;