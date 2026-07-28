import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import GalleryContext from '../context/GalleryContext'
import TourPlanner from '../context/TourPlanner'
import B1 from '../assets/banner/Banner1.png'
import B2 from '../assets/banner/Banner2.png'
import B3 from '../assets/banner/Banner3.png'
import useGetLocal from '../customHook/useGetLocal'
import useSetLocal from '../customHook/useSetLocal'

const Home = () => {

  const [places, setPlaces] = useState([])
  const [state, setState] = useState([])
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [activeUser, setActiveUser] = useState(null)



  const { handleDetail } = useContext(GalleryContext)
  const { handleTourPlan } = useContext(TourPlanner)
  const [current, setCurrent] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const trackIndexRef = useRef(1);

  const images = [B3, B1, B2];
  const carouselSlides = [images[images.length - 1], ...images, images[0]];
  const SLIDE_WIDTH = 60;

  trackIndexRef.current = trackIndex;

  const next = () => {
    setTrackIndex((prev) => {
      if (prev >= carouselSlides.length - 1) return prev;
      setCurrent((c) => (c + 1) % images.length);
      return prev + 1;
    });
  };


  const prev = () => {
    setTrackIndex((prev) => {
      if (prev <= 0) return prev;
      setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
      return prev - 1;
    });
  };

  const handleBannerTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return;

    const idx = trackIndexRef.current;

    if (idx === carouselSlides.length - 1) {
      setEnableTransition(false);
      setTrackIndex(1);
    } else if (idx === 0) {
      setEnableTransition(false);
      setTrackIndex(carouselSlides.length - 2);
    }
  };

  useEffect(() => {
    if (!enableTransition) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [enableTransition]);

  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);


  const placesData = import.meta.env.VITE_API_PLACE_URL
  const imageUrl = import.meta.env.VITE_API_SPLASH_KEY


  useEffect(() => {
    const loadData = async () => {

      const storeData = JSON.parse(localStorage.getItem("apiData"))
     
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

            console.log(e.name, data);




            return {
              ...e,
              image: data.results?.map((e) => e.urls.raw) || "fallback.jpg"
            };
          })
        );
        localStorage.setItem("apiData", JSON.stringify(updatedPlaces))
        setPlaces(updatedPlaces)
        const unique = [...new Set(updatedPlaces.map((e) => e.state))]
        setState(unique)

        return console.log("api call");

      }


      setPlaces(storeData);

      const unique = [...new Set(storeData.map((e) => e.state))]
      setState(unique)

    };
    loadData();

  }, []);

  useEffect(() => {
    const allUser = JSON.parse(localStorage.getItem("UserData")) || [];
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    if (activeUser) {
      const curUser = allUser.find((e) => e.userEmail === activeUser.userEmail)
      setActiveUser(curUser)
    }
  }, [])


  const display = useMemo(() => {
    let data = [...places];

    if (search) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.state.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stateFilter) {
      data = data.filter((e) =>
        e.state.toLowerCase().includes(stateFilter.toLowerCase())
      );
    }

    return data;
  }, [places, search, stateFilter]);




  const stateMap = useMemo(() => {
    return places.reduce((acc, item) => {
      const stateName = item.state;
      const imageUrl = item.image?.[3];

      if (!acc[stateName]) {
        acc[stateName] = imageUrl;
      }

      return acc;
    }, {});
  }, [places]);

  const handleFav = (desti) => {
    const allUser = JSON.parse(localStorage.getItem("UserData")) || [];
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    if (!activeUser) {
      alert("Login");
      return;
    }

    const updatedUsers = allUser.map((user) => {
      if (user.userEmail === activeUser.userEmail) {
        const updatedFav = user.favPlace?.includes(desti)
          ? user.favPlace
          : [...(user.favPlace || []), desti];

        return { ...user, favPlace: updatedFav };
      }
      return user;
    });

    localStorage.setItem("UserData", JSON.stringify(updatedUsers));

    const updatedActiveUser = updatedUsers.find(
      (u) => u.userEmail === activeUser.userEmail
    );

    localStorage.setItem("activeUser", JSON.stringify(updatedActiveUser));

    setActiveUser(updatedActiveUser);
  }


  const handleRemoveFav = (desti) => {
    const allUser = JSON.parse(localStorage.getItem("UserData")) || [];
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    let curUser = allUser.find((e) => e.userEmail === activeUser.userEmail);

    const removeFav = curUser.favPlace.filter((e) => e !== desti);
    curUser.favPlace = removeFav;

    const storeLocal = allUser.map((e) =>
      e.userEmail === curUser.userEmail ? curUser : e
    );

    localStorage.setItem("UserData", JSON.stringify(storeLocal));
    localStorage.setItem("activeUser", JSON.stringify(curUser));

    setActiveUser(curUser);
  };


  const handleSearch = (e)=>{
    setSearch(e.target.value)
  }







  return (
    <div >

      <div className="relative w-full h-[70vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-black">

        {/* Sliding peek carousel — prev/next visible in side spaces */}
        <div className="h-full overflow-hidden">
          <div
            className={`flex h-full items-center ${enableTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{
              transform: `translateX(calc((100% - ${SLIDE_WIDTH}%) / 2 - ${trackIndex * SLIDE_WIDTH}%))`,
            }}
            onTransitionEnd={handleBannerTransitionEnd}
          >
            {carouselSlides.map((img, index) => (
              <div
                key={index}
                className={`h-full w-[60%] flex-shrink-0 flex items-center justify-center ${index === trackIndex ? 'z-10' : 'z-0'
                  }`}
              >
                <img
                  src={img}
                  alt={`banner-${index}`}
                  className={`object-contain object-center ${enableTransition ? 'transition-all duration-700 ease-in-out' : ''
                    } ${index === trackIndex
                      ? 'h-full w-full scale-100 opacity-100'
                      : 'h-[52%] w-[88%] scale-90 opacity-75'
                    }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev Button (full-height overlay) */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute inset-y-0 left-0 flex items-center justify-center w-16 md:w-20 bg-gradient-to-r from-black/60 to-transparent hover:from-black/70 text-white z-20"
        >
          <span className="text-3xl md:text-4xl">❮</span>
        </button>

        {/* Next Button (full-height overlay) */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute inset-y-0 right-0 flex items-center justify-center w-16 md:w-20 bg-gradient-to-l from-black/60 to-transparent hover:from-black/70 text-white z-20"
        >
          <span className="text-3xl md:text-4xl">❯</span>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${current === i ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      <div>
        <input type="text" placeholder='Search' onChange={handleSearch} />
      </div>

      {/* //State Cards */}
      <div >
        <div>
          <h1>Popular State</h1>
        </div>
        <div className='flex gap-10'>
          {
            state.map((e, i) => (
              <button key={i} onClick={() => handleState(e)} className="block cursor-pointer" >
                <div>
                  <img src={stateMap?.[e] || "/default.jpg"} alt={e} className="w-200 pointer-events-none" />
                  <p>{e}</p>
                </div>
              </button>
            ))
          }
        </div>

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
                {
                  (activeUser?.favPlace?.includes(e.name) ? (
                    <button onClick={() => handleRemoveFav(e.name)}>
                      Remove from Favourite
                    </button>
                  ) : (
                    <button onClick={() => handleFav(e.name)}>
                      Add to Favourite
                    </button>
                  ))}
              </div>
              <div>
                <button onClick={() => handleDetail(e)}>View Detail</button>
                <button onClick={() => handleTourPlan(e)}>Plan tour</button>
              </div>
            </div>

          ))}
        </div>

      </div>
    </div>
  )
}

export default Home