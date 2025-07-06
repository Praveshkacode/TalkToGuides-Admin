import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import {toast} from 'react-toastify'

export const ExpertContext = createContext()

const ExpertContextProvider = (props) => {

    const backendUrl= import.meta.env.VITE_BACKEND_URL 

    const [eToken,setEToken] = useState(localStorage.getItem('eToken')?localStorage.getItem('eToken'):'')

    const [sessions,setSessions] = useState([])
    const [profileData,setProfileData] = useState(false)

        const getSessions = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/expert/sessions', {
        headers: { eToken }
        });

        if (data.success) {
        setSessions(data.sessions.reverse());
        } else {
        toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    };



    const getProfileData = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/expert/profile',{headers:{eToken}})

            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData);
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    }

     
    const value = {
        eToken,setEToken,backendUrl,sessions,setSessions,getSessions,profileData,setProfileData,getProfileData
    }



    return (
        <ExpertContext.Provider value={value}>
            {props.children}
        </ExpertContext.Provider>
    )
}

export default ExpertContextProvider;