// Pure LocalStorage utilities (non-hook functions to prevent React Rules of Hooks violations)

export const getLocal = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const removeLocal = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Rich curated fallback places in case remote API is slow or unreachable
export const INITIAL_PLACES = [
  {
    id: "1",
    name: "Jaipur",
    state: "Rajasthan",
    rating: 4.8,
    pricePerDay: 3500,
    bestSeason: "October - March",
    description: "Known as the Pink City, Jaipur is world-famous for its majestic palaces, ancient forts, bustling bazaars, and rich royal heritage.",
    tags: ["Amber Fort", "Hawa Mahal", "City Palace", "Chokhi Dhani"],
    image: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "2",
    name: "Manali",
    state: "Himachal Pradesh",
    rating: 4.7,
    pricePerDay: 4200,
    bestSeason: "September - May",
    description: "A high-altitude Himalayan resort town known for snow-capped peaks, paragliding, river rafting, and serene valley landscapes.",
    tags: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali"],
    image: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597074866923-dc058865e946?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584974292709-5c2f0619971b?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "3",
    name: "Goa",
    state: "Goa",
    rating: 4.9,
    pricePerDay: 5000,
    bestSeason: "November - February",
    description: "India's beach paradise, featuring sun-kissed coastline, Portuguese heritage architecture, vibrant nightlife, and mouth-watering seafood.",
    tags: ["Baga Beach", "Dudhsagar Falls", "Fort Aguada", "Panaji Latin Quarter"],
    image: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "4",
    name: "Munnar",
    state: "Kerala",
    rating: 4.8,
    pricePerDay: 3800,
    bestSeason: "September - March",
    description: "A breathtaking hill station in God's Own Country surrounded by sprawling tea plantations, misty hills, and winding mountain trails.",
    tags: ["Tea Gardens", "Anamudi Peak", "Mattupetty Dam", "Eravikulam National Park"],
    image: [
      "https://images.unsplash.com/photo-1506461883276-594a12b11ce3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "5",
    name: "Varanasi",
    state: "Uttar Pradesh",
    rating: 4.6,
    pricePerDay: 2800,
    bestSeason: "October - March",
    description: "One of the world's oldest continually inhabited cities, sacred to spiritual seekers and famous for its Ganges River ghats and evening Ganga Aarti.",
    tags: ["Dashashwamedh Ghat", "Kashi Vishwanath", "Sarnath", "Ganga Boat Ride"],
    image: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    id: "6",
    name: "Udaipur",
    state: "Rajasthan",
    rating: 4.9,
    pricePerDay: 4600,
    bestSeason: "September - March",
    description: "The City of Lakes, romantic and scenic with white marble palaces reflecting over calm lake waters and royal courtyards.",
    tags: ["Lake Pichola", "City Palace Udaipur", "Jagmandir", "Saheliyon Ki Bari"],
    image: [
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
    ]
  }
];
