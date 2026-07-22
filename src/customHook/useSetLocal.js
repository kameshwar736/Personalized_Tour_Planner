import React from 'react'

const useSetLocal = (keyName,Value) => {

    const setData = JSON.parse(localStorage.getItem(keyName)) || []
    setData.push(Value)
    localStorage.setItem(keyName,JSON.stringify(setData))
 
    return alert("Data added successfully");
    
}

export default useSetLocal