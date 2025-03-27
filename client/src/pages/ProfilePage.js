import { useState } from 'react';
import '../stylesheets/index.css';
import '../stylesheets/Profile.css';
import AccountSidebar from '../components/AccountSidebar';
import ProfileForm from '../components/ProfileForm';
import VehiclesForm from '../components/VehiclesForm';

export default function ProfilePage() {
  // State to manage the currently active tab ('profile' or 'vehicles')
  const [activeTab, setActiveTab] = useState('profile');

  // Dummy user data to populate the ProfileForm
  const dummyUserData = {
    email: 'michelle.lieberwoman@stonybrook.edu',
    firstName: 'Michelle',
    lastName: 'Lieberwoman',
    username: 'michelle.lieberwoman',
    mobile: '(347) 555-1234',
    dlNumber: '012345678',
    dlState: 'NY',
    address: '4321 Sesame St.',
    city: 'Manhattan',
    state: 'New York',
    zip: '10123',
    country: 'United States'
  };

  // Dummy vehicle data to populate the VehiclesForm
  const dummyVehiclesData = [
    {
      make: 'Chevrolet',
      model: 'Colorado',
      plate: 'ABC1234',
      state: 'NY PA',
      permit: '802250'
    }
  ];

  return (
    <section className='main-container-profile'>
      {/* Sidebar component to display account options and manage active tab */}
      <AccountSidebar
        username={dummyUserData.username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Render ProfileForm if the active tab is 'profile' */}
      {activeTab === 'profile' && <ProfileForm userData={dummyUserData} />}
      
      {/* Render VehiclesForm if the active tab is 'vehicles' */}
      {activeTab === 'vehicles' && <VehiclesForm vehicles={dummyVehiclesData} />}
    </section>
  );
}