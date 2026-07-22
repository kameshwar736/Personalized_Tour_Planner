import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSetLocal from '../customHook/useSetLocal'

const GalleryContext = createContext()

export const GalleryProvider = ({children})=>{

    const [viewDetail,setViewDetail] = useState(false)

    const navigate = useNavigate()

    const handleDetail = (data) => {

         setViewDetail(true)
        localStorage.setItem("tempData",JSON.stringify(data))
        navigate('/login')
        
    }

    return(
        <>
        <GalleryContext.Provider value={{handleDetail , viewDetail}} >
            {children}
        </GalleryContext.Provider>
        
        </>
    )
}

export default GalleryContext