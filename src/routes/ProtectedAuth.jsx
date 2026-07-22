import React from 'react'
import Login from '../pages/Login'

const ProtectedAuth = ({children}) => {

    const activeUser = JSON.parse(localStorage.getItem("activeUser")) 
    console.log(activeUser);
    

  return activeUser? children : <Login/>
}

export default ProtectedAuth