import React, { useState } from 'react'
import useSetLocal from '../customHook/useSetLocal'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const [userRegister,setUserRegister] = useState({userName : "" , userEmail : "" , userPassword : ""})

    const handleChange = (e)=>{
        setUserRegister({...userRegister,[e.target.name] : e.target.value})
    }

   
    const handleClick = ()=>{
         useSetLocal("UserData",userRegister)
    }





  return (
   <>
   <div>
    <input placeholder='Enter the Name' value={userRegister.userName} name='userName' onChange={handleChange}/>
    <input placeholder='Enter the Email' value={userRegister.userEmail} name='userEmail' onChange={handleChange}/>
    <input placeholder='Enter the password' value={userRegister.userPassword} name='userPassword' onChange={handleChange}/>
    <input type='submit' value={"Register"} onClick={handleClick} />
   </div>
   <div>
    <button onClick={()=>navigate('/login')}>Login</button>
   </div>
   
   </>
  )
}

export default Register