import { useEffect, useState } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/Profile.css';
import '../stylesheets/ProfilePopup.css';
import { ProfileSidebar, ProfileForm, VehiclesForm } from '../components'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
// const HOST = "http://localhost:8000"
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

export default function ProfilePage() {
  // State to track the currently active tab ('profile' or 'vehicles')
  const [activeTab, setActiveTab] = useState('profile');

  // Get the authenticated user from the AuthContext
  const { user } = useAuth(); 

  // State to store the user's vehicles (currently empty)
  const [ vehicles, setVehicles ] = useState([]); 
  const [ refreshToggle, setRefreshToggle ] = useState(false);

  // State to handle Vehicle page
  const [ currVehiclePage, setCurrVehiclePage ] = useState('my_vehicles');
  const [ selectedVehicle, setSelectedVehicle ] = useState(null);

  //retreive user's Vehicles
  useEffect(() => {
    axios.get(`${HOST}/api/auth/${user.user_id}/vehicles`, { withCredentials: true })
      .then(response => setVehicles(response.data.vehicles))
      .catch(err => console.error(err));
  }, [currVehiclePage, refreshToggle]);

  // Handle loading state or fallback if the user data is not yet available
  if (!user) {
    return (
      <div className="page-content" style={{minHeight: 'calc(100vh - 60px - 50px - 50px)'}}>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Map the user object from the context into a structure compatible with ProfileForm
  const userData = {
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    mobile: user.phone_number,
    dlNumber: user.driver_license_number,
    dlState: user.dl_state,
    address: user.address_line,
    city: user.city,
    state: user.state_region,
    zip: user.postal_zip_code,
    country: user.country,
    user_id: user.user_id
  };
  
  return (
    <section className='main-container-profile'>
      {/* Sidebar component to display user info and allow tab switching */}
      <ProfileSidebar
        username={`${userData.firstName || ''} ${userData.lastName || ''}`.trim()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrVehiclePage={setCurrVehiclePage}
        setSelectedVehicle={setSelectedVehicle}
      />

      {/* Render the ProfileForm if the 'profile' tab is active */}
      {activeTab === 'profile' && <ProfileForm userData={userData} />}

      {/* Render the VehiclesForm if the 'vehicles' tab is active */}
      {activeTab === 'vehicles' &&  (
        <VehiclesForm 
          userId={user.user_id}
          currVehiclePage={currVehiclePage} 
          setCurrVehiclePage={setCurrVehiclePage}
          vehicles={vehicles} 
          setSelectedVehicle={setSelectedVehicle}
          selectedVehicle={selectedVehicle}
          toggleRefresh={() => setRefreshToggle(!refreshToggle)}
        />
      )}
    </section>
  );
}
