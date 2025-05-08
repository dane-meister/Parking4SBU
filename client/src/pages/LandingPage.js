import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header.js";
import Search from "../components/Search.js";
import { useOutletContext } from "react-router-dom";
import "../stylesheets/LandingPage.css";
import TimeSelector from "../components/TimeSelector";
import { getInitialTimes } from "../components/Header";
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

function LandingPage() {
  //"hourly" or "daily"
  const [pricingType, setPricingType] = useState("hourly");
  const [buildingLotType, setBuildingLotType] = useState("building");
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const [value, setValue] = useState("");

  const [selectedLot, setSelectedLot] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]); // Declare parkingLots before using it

  // Now it's safe to initialize these with the parkingLots variable
  const [lotResults, setLotResults] = useState(parkingLots);
  const [baseLots, setBaseLots] = useState(parkingLots);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const { times, setTimes } = useOutletContext();
  const [editingMode, setEditingMode] = useState(null);

  // Fetch buildings and parking lots on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Fetch buildings and parking lots data concurrently
        const [buildingsRes, parkingLotsRes] = await Promise.all([
          axios.get(`${HOST}/api/buildings`, { withCredentials: true }),
          axios.get(`${HOST}/api/parking-lots`, { withCredentials: true }),
        ]);

        // Update state with fetched data
        setBuildings(buildingsRes.data);
        setParkingLots(parkingLotsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err); // Log error to console
        setError("Failed to load data."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchData();
  }, []);

  const handleTimeSelect = (mode, formatted) => {
    setTimes((prev) => ({
      ...prev,
      [mode]: formatted,
    }));
    setEditingMode(null);
  };

  const [isSearching, setIsSearching] = useState(false);

  const handleFindParking = () => {
    setIsSearching(true);
    const searchParams = {
      pricingType,
      buildingLotType,
      searchValue: value,
      selectedBuilding,
      times,
      // You can add more parameters if needed
    };

    // Navigate and pass searchParams in the state object
    navigate("/lotselection", { state: searchParams });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleFindParking();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pricingType, buildingLotType, value, selectedBuilding, times]);


  const slogans = [
    "We’ll save you a spot – literally.",
    "Park smarter, not harder.",
    "Because circling the lot is not a cardio workout.",
    "We don’t just find spots. We find the one.",
    "Stony Brook’s real MVP? Most Valuable Parking.",
    "Because you didn’t come to campus to play hide and seek.",
    "Seawolves deserve prime spots.",
    "Spend less time parking, more time doing… anything else.",
    "From lot to lecture in record time.",
    "No stress. No guess. Just park.",
    "Your perfect spot is just a click away.",
    "One tap. One spot. Zero stress.",
    "Find a spot faster than you can say ‘Where the heck do I park?’",
    "Reserved for greatness (and you).",
    "Don’t be that guy circling for 20 minutes.",
    "Because ‘late due to parking’ is so 2020.",
    "We help you park. You focus on passing.",
    "Don’t cry over spilled parking.",
    "You complete me… said the empty spot.",
    "More reliable than your group project partner.",
    "Because ‘I couldn’t find parking’ is not a valid excuse anymore.",
    "You miss 100% of the spots you didn’t reserve.",
    "Tap. Park. Flex.",
    "Manhattan Distance.",
    "No more parking lot prayer circles.",
    "Swipe right on your dream parking spot.",
    "Parking problems? Unmatched.",
    "Because parking should be boring—in a good way.",
    "Don’t park like a freshman.",
    "This is the way. (to your spot)",
    "A+ in finding spots. Can’t help with finals though.",
    "Your car called. It wants a real space.",
    "No more parking sacrifices to the campus gods.",
    "Less rage, more range (of available spots).",
    "You study hard. We’ll handle parking logistics.",
    "Leave the stress in reverse.",
    "Because parking roulette is not a major.",
    "Because your GPA shouldn't depend on finding Lot 12.",
    "No goats were sacrificed to find this spot. Just code.",
    "We can’t park for you, but we’re close.",
    "This app has seen things... mostly you crying in traffic.",
    "Just park it. Before someone else does.",
    "Because you should fear midterms, not meters.",
    "Built by people who have suffered. Just like you.",
    "More accurate than your professor’s grading rubric.",
    "The only place you won’t get ghosted: your reserved spot.",
    "Good spots? We hoard them like it’s our Roman Empire.",
    "You’ve tried manifesting. Now try the app.",
    "Faster than your situationship texting back.",
    "Less wandering. More wondering why you didn’t use this sooner.",
    "Our spots are more committed than your situationship.",
    "Because true love is a reserved space near Frey Hall.",
    "We’ll never leave you on read — or on Circle Road.",
    "‘Parking is hard’ — not on our watch, sweetheart.",
    "Your car deserves a better love story than Twilight.",
    "Seawolves mate for life. So do we... with spots.",
    "Parking shouldn’t require a minor in urban planning.",
    "Sleep in. Skip the lot hunt.",
    "Helping you avoid your ex and parallel parking.",
    "Let’s face it — parking should not be the most stressful part of your day.",
    "You study for tests. We study lot availability.",
    "You’ve got tuition, textbooks, and trauma — let’s take parking off that list.",
    "We can’t help with your GPA, but we’ve got the parking thing.",
    "Avoid parking drama like you avoid campus geese."
  ]
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  const [shuffledSlogans, setShuffledSlogans] = useState(shuffleArray(slogans));
  const [sloganIndex, setSloganIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prevIndex) => {
        if (prevIndex + 1 >= shuffledSlogans.length) {
          setShuffledSlogans(shuffleArray(slogans));
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 6000);
  
    return () => clearInterval(interval);
  }, [shuffledSlogans, slogans]);


  return (
    <div className="landing-page">

      {/* Landing Page Content */}
      <header 
      className="hero" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/campus-hero.png)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
      }}>
      <div className="hero__overlay" />
      <Header />

      <div className="landing-content">
        <h1 key={sloganIndex} className="slogan">{slogans[sloganIndex]}</h1>

        {/* Pricing options (Hourly / Daily) */}
        <div className="pricing-options">
          <button
            className={pricingType === "hourly" ? "option selected" : "option"}
            onClick={() => setPricingType("hourly")}
          >
            Hourly
          </button>
          <button
            className={pricingType === "daily" ? "option selected" : "option"}
            onClick={() => setPricingType("daily")}
          >
            Daily
          </button>
        </div>


        <div className="building-lot-toggle">
          <span
            className={`toggle-option ${buildingLotType === "building" ? "selected" : ""}`}
            onClick={() => setBuildingLotType("building")}
          >
            Building
          </span>
          <span>/</span>
          <span
            className={`toggle-option ${buildingLotType === "lot" ? "selected" : ""}`}
            onClick={() => setBuildingLotType("lot")}
          >
            Lot
          </span>
        </div>
        

        <div className="controls-container">

        <div className="search-container">
        <Search
          searchType={buildingLotType}
          buildings={buildings}
          parkingLots={parkingLots}
          value={value}
          setValue={setValue}
          setSelectedBuilding={setSelectedBuilding}
          setLotResults={setLotResults}
          setBaseLots={setBaseLots}
          setSelectedLot={setSelectedLot}
        />
        </div>


        {/* Time selection bar */}
        <div className="time-selector-container">
          <div className="time-input">
            <span className="time-label">Arrive After:</span>
            <div className="time-row">
              <span className="time-value">{times.arrival}</span>
              <button className="edit-button" onClick={() => setEditingMode("arrival")}>
                <img src="/images/edit-icon1.png" alt="Edit Arrival" className="edit-icon" />
              </button>
            </div>
          </div>
          <div className="arrow-container">
            <img src="/images/arrow1.png" alt="Arrow" className="landing-arrow-icon" />
          </div>
          <div className="time-input">
            <span className="time-label">Exit Before:</span>
            <div className="time-row">
              <span className="time-value">{times.departure}</span>
              <button className="edit-button" onClick={() => setEditingMode("departure")}>
                <img src="/images/edit-icon1.png" alt="Edit Departure" className="edit-icon" />
              </button>
            </div>
          </div>
          {editingMode && (
            <TimeSelector
              mode={editingMode}
              initialTimes={times}
              onSelect={handleTimeSelect}
              onClose={() => setEditingMode(null)}
            />
          )}
        </div>

        <div className="find-parking-btn">
          <button onClick={handleFindParking} disabled={isSearching}>
            {isSearching && <span className="spinner" />}
            {isSearching ? "Searching…" : (
              <>
                <img
                  src="/images/search-icon.webp"
                  alt="Search Icon"
                  style={{ width: 16, height: 16 }}
                />
                Find Parking
              </>
            )}
          </button>
        </div>
        </div>
      </div>
      </header>

       {/*  FEATURES  */}
       <section className="features">
        <div className="features-content">
          <h2>Our Core Features</h2>
          <div className="features-grid">
          <div className="feature-card">
              <i className="icon-calendar" />  
              <h3>Reserve in Advance</h3>
              <p>Book your spot before you even leave home—never circle the lot again.</p>
            </div>
            <div className="feature-card">
              <i className="icon-clock" />
              <h3>Flexible Durations</h3>
              <p>Hourly, daily, or longer—pick the plan that fits your schedule and campus life.</p>
            </div>
            <div className="feature-card">
              <i className="icon-map-pin" />
              <h3>Real‑Time Availability</h3>
              <p>Our wayfinding service shows you exactly which lots have free spaces right now.</p>
            </div>
            <div className="feature-card">
              <i className="icon-shield-check" />
              <h3>Secure &amp; Seamless</h3>
              <p>Enjoy safe payments, protected data, and an intuitive experience from start to finish.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default LandingPage;