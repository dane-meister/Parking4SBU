import { useState } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/Profile.css';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';
import VehiclesForm from '../components/VehiclesForm';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth(); 
  const [vehicles] = useState([]); 

  // Handle loading/fallback
  if (!user) {
    return (
      <div className="page-content">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Map context user object into ProfileForm structure
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
      <ProfileSidebar
        username={`${userData.firstName || ''} ${userData.lastName || ''}`.trim()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'profile' && <ProfileForm userData={userData} />}
      {activeTab === 'vehicles' && <VehiclesForm vehicles={vehicles} />}
    </section>
  );
}
