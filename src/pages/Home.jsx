import React, { useContext, useEffect, useState } from 'react'

import GalleryContext from '../context/GalleryContext'
import TourPlanner from '../context/TourPlanner'
import B1 from '../assets/banner/Banner1.png'
import B2 from '../assets/banner/Banner2.png'
import B3 from '../assets/banner/Banner3.png'

const Home = () => {

  const [places, setPlaces] = useState([])
  const [state, setState] = useState([])
  const [search, setSearch] = useState("")
  const [stateFilter,setStateFilter] = useState("")
  

  const {handleDetail} = useContext(GalleryContext)
  const {handleTourPlan} = useContext(TourPlanner)
  const [current, setCurrent] = useState(0);

  const images = [B3, B1, B2];

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };


  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

   useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);


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



  



  return (
    <div >
     
      <div className="relative w-full h-[70vh] overflow-hidden">

        {/* Image Container */}
        <div className="relative h-[350px]">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`absolute w-full h-full object-cover transition-opacity duration-700 ${current === index ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black"
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={next}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${current === i ? "bg-white" : "bg-gray-400"
                }`}
            />
          ))}
        </div>
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
                <button onClick={()=>handleTourPlan(e)}>Plan tour</button>
              </div>
            </div>
          
          
      
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Home