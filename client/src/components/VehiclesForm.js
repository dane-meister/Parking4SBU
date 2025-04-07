import React, { useState } from 'react';

export default function VehiclesForm({ vehicles, currVehiclePage, setCurrVehiclePage }) {
    return (
        <section className="profile-form">
            {currVehiclePage === 'my_vehicles' && <MyVehicles vehicles={vehicles} setCurrVehiclePage={setCurrVehiclePage}/>}
            {currVehiclePage === 'add_vehicle' && <AddVehicle setCurrVehiclePage={setCurrVehiclePage}/>}
        </section>
    );
}

function MyVehicles({ vehicles, setCurrVehiclePage }){
    return (<>
        <h2>My Vehicles</h2>

        {vehicles.map((vehicle, index) => (
            <div className="vehicle-card" key={index}>
                <p><strong>Make:</strong> {vehicle.make}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Plate:</strong> {vehicle.plate}</p>
                <p><strong>State:</strong> {vehicle.state}</p>
                <p><strong>Permit #:</strong> {vehicle.permit}</p>
            </div>
        ))}

        {/* If no vehicles, display a message */}
        {vehicles.length === 0 && <p style={{ color: 'gray' }}>No Vehicles Added</p>}
        {/* Button to add a new vehicle */}
        <button 
            className="add-vehicle-btn add-vehicle" 
            onClick={() => setCurrVehiclePage('add_vehicle')}
        >+ Add Vehicle</button>
    </>);
}

function AddVehicle({ setCurrVehiclePage }){
    return (<>
        <div className='vehicle-top-row'>
            <h2>Add a Vehicle</h2>
            <img 
                src='/images/x.png' 
                onClick={() => setCurrVehiclePage('my_vehicles')}
                alt='close'
            />
        </div>
        <label htmlFor='vehicle-make'>Make*</label>
        <input id='vehicle-make' type="text" placeholder='Make' />

        <label htmlFor='vehicle-model'>Model*</label>
        <input id='vehicle-model' type="text" placeholder='Model' />

        <label htmlFor='vehicle-year'>Year*</label>
        <input id='vehicle-year' type="text" placeholder='Year' />

        <label htmlFor='vehicle-color'>Color*</label>
        <input id='vehicle-color' type="text" placeholder='Color' />
    </>);
}