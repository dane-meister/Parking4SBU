import { useEffect, useState } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/Profile.css';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';
import VehiclesForm from '../components/VehiclesForm';
import axios from 'axios';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auth/me', {
          withCredentials: true
        });

        const user = res.data.user;

        setUserData({
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
        });

        // 🚧 Optionally fetch vehicles data here (if available from another route)
        setVehicles([]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="page-content"><p>Loading...</p></div>;

  return (
    <section className='main-container-profile'>
      <ProfileSidebar
        username={`${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'profile' && <ProfileForm userData={userData} />}
      {activeTab === 'vehicles' && <VehiclesForm vehicles={vehicles} />}
    </section>
  );
}
