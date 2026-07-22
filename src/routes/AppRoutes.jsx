import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import AboutDesti from '../pages/AboutDesti'
import Register from '../pages/Register'
import Login from '../pages/Login'

const AppRoutes = () => {
  return (
   <>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<AboutDesti/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
   </Routes>
   </>
  )
}

export default AppRoutes