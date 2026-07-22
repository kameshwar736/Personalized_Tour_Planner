import React, { useContext, useState } from 'react'
import useGetLocal from '../customHook/useGetLocal'
import { useNavigate } from 'react-router-dom'
import GalleryContext from '../context/GalleryContext'

const Login = () => {

    const [userLogin,setUserLogin] = useState({userEmail : "" , userPassword : ""})

    const navigate = useNavigate()

    const {viewDetail} = useContext(GalleryContext)

    const handleChange = (e)=>{
        setUserLogin({...userLogin,[e.target.name] : e.target.value})
    }

   
    const handleClick = ()=>{
         const localUSer = useGetLocal("UserData")
        
         const validateUser = localUSer.find((e)=>e.userEmail === userLogin.userEmail && e.userPassword === userLogin.userPassword)
     
        if(validateUser){
          if(viewDetail){
            navigate('/about')
          }else{
            navigate('/')
          }

         
          
        }else{
          alert("not a valid user")
        }
         
         
    }








  return (
   <>
   <div>
    
    <input placeholder='Enter the Email' value={userLogin.userEmail} name='userEmail' onChange={handleChange}/>
    <input placeholder='Enter the password' value={userLogin.userPassword} name='userPassword' onChange={handleChange}/>
    <input type='submit' value={"Login"} onClick={handleClick} />
   </div>
   <div>
    <button onClick={()=>navigate('/register')}>Create Account</button>
   </div>
   
   </>
  )
}
export default Login