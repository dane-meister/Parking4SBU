import { useState } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/Profile.css';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';
import VehiclesForm from '../components/VehiclesForm';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  // State to track the currently active tab ('profile' or 'vehicles')
  const [activeTab, setActiveTab] = useState('profile');

  // Get the authenticated user from the AuthContext
  const { user } = useAuth(); 

  // State to store the user's vehicles (currently empty)
  const [ vehicles ] = useState([]); 

  // State to handle Vehicle page
  const [ currVehiclePage, setCurrVehiclePage ] = useState('my_vehicles');
  const [ selectedVehicle, setSelectedVehicle ] = useState(null);

  // Handle loading state or fallback if the user data is not yet available
  if (!user) {
    return (
      <div className="page-content">
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
    country: user.country
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
          currVehiclePage={currVehiclePage} 
          setCurrVehiclePage={setCurrVehiclePage}
          vehicles={vehicles} 
          setSelectedVehicle={setSelectedVehicle}
          selectedVehicle={selectedVehicle}
        />
      )}
    </section>
  );
}
