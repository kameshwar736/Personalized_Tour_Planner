import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
   <>
   <div className='bg-yellow-100 flex justify-between px-25 p-10'>
    <div>Logo</div>
    <div className=' flex gap-10'>
        <Link to={'/'}>Home</Link>
         <Link to={'/tours'}>Plan Tour</Link>
        <Link>Blogs</Link>
        <Link to={'/profile'}>Profile</Link>    
    </div>
   </div>
   </>
  )
}

export default Navbar