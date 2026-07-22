import React from 'react'

const useGetLocal = (keyName) => {
    const getData = JSON.parse(localStorage.getItem(keyName)) || []  
    return getData
}

export default useGetLocal