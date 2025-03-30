import React from 'react';

export default function VehiclesForm({ vehicles }) {
    return (
        <section className="profile-form">
            <h2>My Vehicles</h2>

            {/* Render each vehicle in the vehicles array */}
            {vehicles.map((vehicle, index) => (
                <div className="vehicle-card" key={index}>
                    <p><strong>Make:</strong> {vehicle.make}</p>
                    <p><strong>Model:</strong> {vehicle.model}</p>
                    <p><strong>Plate:</strong> {vehicle.plate}</p>
                    <p><strong>State:</strong> {vehicle.state}</p>
                    <p><strong>Permit #:</strong> {vehicle.permit}</p>
                </div>
            ))}

            {/* Button to add a new vehicle */}
            <div className="add-vehicle">
                {/* If no vehicles, display a message */}
                {vehicles.length === 0 && <p style={{ color: 'gray' }}>No Vehicles Added</p>}
                <button className="add-vehicle-btn">+ Add Vehicle</button>
            </div>
        </section>
    );
}
