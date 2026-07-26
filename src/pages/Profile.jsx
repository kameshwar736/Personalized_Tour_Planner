import React, { useEffect, useState } from 'react'
import useGetLocal from '../customHook/useGetLocal'

const Profile = () => {

    const [userProfile,setUserProfile] = useState({})
    const [userInput,setUserInput] = useState({})

    const [edit,setEdit] =useState(false)



    useEffect(()=>{
        const activeUser = useGetLocal("activeUser") // obj
        const allUser = useGetLocal("UserData") //arr
            
        const findUser = allUser.find((e)=>e.userEmail == activeUser.userEmail)
        setUserProfile(findUser)

        setUserInput({
            ...findUser,
            userPhone: findUser?.userPhone || "",
            userState: findUser?.userState || ""
        })

    },[])

    console.log(userInput);
    


    const handleEdit =()=>{

        setEdit(!edit)

    }
// {userName: 'kamesh', userEmail: 'kshkamesh75@gmail.com', userPassword: '123456'}

  return (
    <>
    <div>
        <h1>Profile</h1>
          <div>
                <button onClick={handleEdit}>{edit?"Save":"Edit"}</button>
            </div>
        <div className= {`${edit?"hidden":"block"}`}>
           <p>name : {userProfile?.userName}</p>
           <p>Email : {userProfile?.userEmail}</p>
           <p>Phone : {userProfile.userPhone?userProfile.userPhone:"Yet to be fill"}</p>
           <p>State : {userProfile.userState?userProfile.userState:"Yet to be fill"}</p>
          
        </div>
        <div className={`${edit?"block":"hidden"}`}>
            <form>
                <input type="text"  placeholder='enter the name' name='userName' value={userInput.userName}/>
                <input type="text"  placeholder='enter the name' name='userEmail' value={userInput.userEmail}/>
                <input type="text"  placeholder='enter the name' name='userPhone' value={userInput.userPhone}/>
                <input type="text"  placeholder='enter the name' name='userState' value={userInput.userState}/>
            </form>
        </div>
        <div>
            Favourite Places
        </div>
    </div>
    </>
  )
}

export default Profile