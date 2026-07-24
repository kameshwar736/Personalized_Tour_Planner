import React, { createContext } from 'react'
import useSetLocal from '../customHook/useSetLocal'
import { useNavigate } from 'react-router-dom'

const TourPlanner = createContext()




export const PlanProvider = ({children})=>{

    const navigate = useNavigate()

    const handleTourPlan = (tourPlace)=>{
      
      useSetLocal("currentTour",tourPlace)  
      localStorage.setItem("tempPlan",JSON.stringify(tourPlace.id))
      navigate('/planner')
    }

    const handleView =(id)=>{
        localStorage.setItem("tempPlan",JSON.stringify(id))
      navigate('/planner')
    }

    return(
        <>
        <TourPlanner.Provider value={{handleTourPlan,handleView}}>
            {children}
        </TourPlanner.Provider>
        </>
    )

}




export default TourPlanner