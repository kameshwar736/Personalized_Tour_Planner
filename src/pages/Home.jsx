import React, { useContext, useEffect, useState } from 'react'

import GalleryContext from '../context/GalleryContext'

const Home = () => {

  const [places, setPlaces] = useState([])
  const [state, setState] = useState([])
  const [search, setSearch] = useState("")
  const [stateFilter,setStateFilter] = useState("")
  



  const placesData = import.meta.env.VITE_API_PLACE_URL
  const imageUrl = import.meta.env.VITE_API_SPLASH_KEY


  useEffect(() => {
    const loadData = async () => {

      const storeData = JSON.parse(localStorage.getItem("apiData"))
      console.log(storeData);


      if (!storeData) {
        console.log("runn");

        const getData = await fetch(placesData);
        const changeType = await getData.json();

        const updatedPlaces = await Promise.all(
          changeType.map(async (e) => {
            const res = await fetch(
              `https://api.unsplash.com/search/photos?query=${e.name}&client_id=${imageUrl}`
            )

            const data = await res.json()
            // const data = await res.json();

            console.log(e.name,data);


            

            return {
              ...e,
              image: data.results?.map((e)=>e.urls.raw) || "fallback.jpg"
            };
          })
        );
        localStorage.setItem("apiData", JSON.stringify(updatedPlaces))
        setPlaces(updatedPlaces)
        const unique = [...new Set(updatedPlaces.map((e) => e.state))]
        setState(unique)

        return console.log("api call");

      }
      console.log("loacal call");

      setPlaces(storeData);

      const unique = [...new Set(storeData.map((e) => e.state))]
      setState(unique)

    };
    loadData();

  }, []);

  let display = [...places]

  const handleState = (state)=>{
    setStateFilter(state)    
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }



  if (search ) {
    display = display.filter((e) =>
      (e.name.toLowerCase() ).includes(search.toLowerCase()) ||  (e.state.toLowerCase() ).includes(search.toLowerCase())
    )
  }

  
  if(stateFilter){
    display = display.filter((e) =>(e.state.toLowerCase()).includes(stateFilter.toLowerCase()))   
  }

  const {handleDetail} = useContext(GalleryContext)
  



  return (
    <div>
      <div>
        Banner
      </div>
      <div>
        <input type="text" placeholder='Search' onChange={handleSearch} />
      </div>
      <div>
        {
          state.map((e,i) => (
            <button key={i} onClick={() => handleState(e)}>{e}</button>
          ))
        }
      </div>

      <div>
        <h1>Highly Recommeded this season</h1>
        <div>
          {display.map((e) => (
            <div key={e.id}>
              <div>
                <img src={e.image[0]} alt="load" className='w-100 h-100' />
              </div>
              <h1>{e.name}</h1>
              <p>{e.state}</p>
              <p>{e.rating}</p>
              <div>
                <button onClick={()=>handleDetail(e)}>View Detail</button>
                <button>Plan tour</button>
              </div>
            </div>
          
          
      
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Home