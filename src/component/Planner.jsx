import React, { useEffect, useState } from 'react'
import useGetLocal from '../customHook/useGetLocal'
import useSetLocal from '../customHook/useSetLocal'

const Planner = () => {

    const [editTour,setEditTour] = useState({})
    const [userInfo,setUserInfo] = useState({tourMode : "",peopleCount : "" , tarvelMode : "" , Duration : "" , startFrom : "" ,budget : ""})
    const [diplayInfo,setDisplayInfo] = useState({})
    
    useEffect(()=>{
        const tempID = useGetLocal("tempPlan")
        const currentTour = useGetLocal("currentTour")
        const searchPlan = currentTour?.filter((e)=>e.id === tempID)

        if (searchPlan[0]?.tourPlan) {
            setDisplayInfo(searchPlan[0])
            console.log("run if");
        } else {
            setEditTour(searchPlan[0])
            console.log("ok");
        }
    
       
        

       
    },[])

    

    const handleChange = (e)=>{

        setUserInfo({...userInfo,[e.target.name]:e.target.value})
    }

    const tourInfo = {...editTour,tourPlan :{...userInfo}}

    const handleClick = ()=>{
        const currentTour = useGetLocal("currentTour")
        const editCurrentTour = currentTour.map((e)=>e.id===tourInfo.id?tourInfo:e)
        localStorage.setItem("currentTour",JSON.stringify(editCurrentTour))
        setDisplayInfo(tourInfo)
        
    }

    const displayData = {...diplayInfo}
    
     



  return (
    <>
    <div>
        <h1>{tourInfo.name}</h1>
        <div>
           <select onChange={handleChange} name='tourMode'>
            <option value="Solo">Solo</option>
            <option value="Friends">Friends</option>
            <option value="family">family</option>
           </select>

           <input type="number" placeholder='no of people' onChange={handleChange} name='peopleCount'/> 

           <select onChange={handleChange} name='tarvelMode'>
            <option selected disabled>travel mode</option>
            <option value="Flight">Flight</option>
            <option value="car">car</option>
            <option value="bike">bike</option>
            <option value="bus">bus</option>
           </select>



           <input type="number" placeholder='Duration' onChange={handleChange}  name='Duration'/>

            <label>start From</label>
           <input type="date"  onChange={handleChange} name='startFrom'/>

           

           <input type="number" placeholder='budget' onChange={handleChange} name='budget'/>

            <button onClick={handleClick}>Plan trip</button>
        </div>
    </div>
    
    // summarize trip
    <div>

        <div>
            <h1>{displayData.name}</h1>
            <p>rating : {displayData.rating}</p>
        </div>
        <div>
            <p>Must thing to Witness</p>
            {
                displayData?.tags?.map((e,i)=>(
                    <div key={i}>
                        <span>{e}</span>
                    </div>
                ))
            }
        </div>
        <div>
            <h1>{displayData?.tourPlan?.tourMode}</h1>
            <p>{displayData?.tourPlan?.peopleCount}</p>
            <p>{displayData?.tourPlan?.tarvelMode}</p>
            <p>{displayData?.tourPlan?.Duration}</p>
            <p>{displayData?.tourPlan?.startFrom}</p>
            <p>{displayData?.tourPlan?.budget}</p>
        </div>

    </div>

    </>
  )
}

export default Planner