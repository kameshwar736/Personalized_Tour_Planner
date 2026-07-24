import React, { useContext, useEffect, useState } from 'react'
import useGetLocal from '../customHook/useGetLocal.js'
import useSetLocal from '../customHook/useSetLocal.js'
import { useNavigate } from 'react-router-dom'
import TourPlanner from '../context/TourPlanner.jsx'

const Tours = () => {

  const [tourPlans,setTourPlans] = useState([])

  const navigate = useNavigate()

  const {handleView} = useContext(TourPlanner)

  useEffect(()=>{

    const getTourPlans = useGetLocal("currentTour")
    setTourPlans(getTourPlans)

  },[])

  const handleDelete = (id)=>{

    const deletePlan = tourPlans.filter((e)=>e.id !== id)
    localStorage.setItem("currentTour",JSON.stringify(deletePlan))
    setTourPlans(deletePlan)

  }








  return (
  <>
  <div>

      {
        tourPlans?.map((e)=>(
          <div key={e.id}>
            <div>
              <img src={e.image[1]} alt=""  className='w-100'/>
            </div>
            <div>
              <h1>{e.name}</h1>
              <p>{e.tourPlan?.tourMode}</p>
            </div>
            <div>
              <p>Start from {e.tourPlan?.startFrom}</p>
              <p>travel Mode {e.tourPlan?.tarvelMode}</p>
            </div>
            <div>
              <button onClick={()=>handleDelete(e.id)}>Delete</button>
              <button onClick={()=>handleView(e.id)}>view plan</button>
            </div>
          </div>
        ))
      }

  </div>
    </>
  )
}

export default Tours