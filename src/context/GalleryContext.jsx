import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSetLocal from '../customHook/useSetLocal'
import useGetLocal from '../customHook/useGetLocal'
import AboutDesti from '../pages/AboutDesti'
import Login from '../pages/Login'

const GalleryContext = createContext()

export const GalleryProvider = ({children})=>{


    const navigate = useNavigate()

    const handleDetail = (data) => {

        localStorage.setItem("tempData",JSON.stringify(data))

        const activeUser =  useGetLocal("activeUser")

        if(activeUser){      
            navigate('/about')
        }else{
             navigate('/login')
        }
        
    }

    return(
        <>
        <GalleryContext.Provider value={{handleDetail}} >
            {children}
        </GalleryContext.Provider>
        
        </>
    )
}

export default GalleryContext