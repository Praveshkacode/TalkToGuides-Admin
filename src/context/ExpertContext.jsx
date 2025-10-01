import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import {toast} from 'react-toastify'

export const ExpertContext = createContext()

const ExpertContextProvider = (props) => {

    const backendUrl= import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000' 

    const [eToken,setEToken] = useState(localStorage.getItem('eToken')?localStorage.getItem('eToken'):'')

    const [sessions,setSessions] = useState([])
    const [profileData,setProfileData] = useState(false)

        const getSessions = async () => {
    try {
        console.log('Getting sessions with token:', eToken)
        console.log('Backend URL:', backendUrl)
        
        const { data } = await axios.get(backendUrl + '/api/expert/sessions', {
        headers: { 
            eToken: eToken,
            Authorization: `Bearer ${eToken}`
        }
        });

        console.log('Sessions response:', data)
        
        if (data.success) {
        setSessions(data.sessions.reverse());
        } else {
        toast.error(data.message);
        }
    } catch (error) {
        console.log('Sessions error:', error);
        console.log('Error details:', error.response?.data);
        toast.error(error.response?.data?.message || error.message);
    }
    };



    const getProfileData = async() => {
        try {
            console.log('Getting profile with token:', eToken)
            const {data} = await axios.get(backendUrl+'/api/expert/profile',{
                headers:{
                    eToken: eToken,
                    Authorization: `Bearer ${eToken}`
                }
            })

            console.log('Profile response:', data)
            
            if(data.success){
                setProfileData(data.profileData)
                console.log('Profile data set:', data.profileData);
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log('Profile error:', error)
            console.log('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || error.message) 
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