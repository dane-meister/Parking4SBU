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
    // TEMP override for testing frontend
    vehicles = [
        { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'green', isDefault: true},
        { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'green' },
        { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'green' },
        { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'green' },
        { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'green' },
    ];
    return (<>
        <h2>My Vehicles</h2>
        <section className='vehicle-card-grid'>
            {vehicles.map((vehicle, index) => (
                <div className="vehicle-card" key={index}>
                    <div className='vehicle-card-header'>
                        <img src='/images/car.png' alt='car icon'/>
                        <h3>{vehicle.plate}</h3>
                        {vehicle.isDefault && <span className='vehicle-default-txt'>(default)</span>}
                    </div>
                    <div>{vehicle.make} {vehicle.model} </div>
                    <div>{vehicle.year}, {vehicle.color}</div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px'}}>
                        {!vehicle.isDefault && <button className='vehicle-card-btn' id='vehicle-card-default-btn'>Make Default</button>}
                        <button className='vehicle-card-btn' id='vehicle-card-edit-btn'>
                            <img src='/images/edit-icon.png' alt='edit icon' />
                            Edit
                        </button>
                        <button className='vehicle-card-btn' id='vehicle-card-delete-btn'>
                            <img src='/images/trash.png' alt='delete icon' />
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </section>

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
    const [ plate, setPlate ] = useState('');
    const [ make, setMake ] = useState('');
    const [ model, setModel ] = useState('');
    const [ year, setYear ] = useState('');
    const [ color, setColor ] = useState('');

    function handleAddVehicleSubmit(event){
        const plateErr = document.getElementById('vehicle-plate-err');
        const makeErr = document.getElementById('vehicle-make-err');
        const modelErr = document.getElementById('vehicle-model-err');
        const yearErr = document.getElementById('vehicle-year-err');
        const colorErr = document.getElementById('vehicle-color-err');

        event.preventDefault();
        plateErr.innerHTML = !plate.trim() 
            ? 'Plate number cannot be empty!'
            : '';
        
        makeErr.innerHTML = !make.trim()
            ? 'Vehicle make cannot be empty!'
            : '';
        
        modelErr.innerHTML = !model.trim()
            ? 'Vehicle model cannot be empty!'
            : '';
        
        if(!year){
            yearErr.innerHTML = 'Vehicle year cannot be empty!';
        }else if(!/^\d{4}$/.test(year.trim())){
            yearErr.innerHTML = 'Vehicle year must be a valid year!';
        }else if(parseInt(year.trim()) > 2200 || parseInt(year.trim()) < 1700){
            yearErr.innerHTML = 'Vehicle year must be a valid year!';
        }else{
            yearErr.innerHTML = '';
        }

        colorErr.innerHTML = !color
            ? 'Vehicle color must be selected!'
            : '';

        let hadError = [plateErr, makeErr, modelErr, yearErr, colorErr]
            .map(errorElem => errorElem.innerHTML)
            .some(innerHTML => innerHTML !== '');
        
        if(hadError) return;
        /* implement backend here */        
    }

    return (<>
        <div className='vehicle-top-row'>
            <h2>Add a Vehicle</h2>
            <img 
                src='/images/x.png' 
                onClick={() => setCurrVehiclePage('my_vehicles')}
                alt='close'
            />
        </div>
        <form onSubmit={handleAddVehicleSubmit}>
            <label htmlFor='vehicle-plate'>Plate #*</label>
            <input id='vehicle-plate' type="text" placeholder='Plate Number' 
                value={plate}
                onChange={(event) => setPlate(event.target.value)}
            />
            <p id='vehicle-plate-err' className='profile-error'></p>

            <label htmlFor='vehicle-make'>Make*</label>
            <input id='vehicle-make' type="text" placeholder='Make' 
                value={make}
                onChange={(event) => setMake(event.target.value)}
            />
            <p id='vehicle-make-err' className='profile-error'></p>


            <label htmlFor='vehicle-model'>Model*</label>
            <input id='vehicle-model' type="text" placeholder='Model' 
                value={model}
                onChange={(event) => setModel(event.target.value)}
            />
            <p id='vehicle-model-err' className='profile-error'></p>


            <label htmlFor='vehicle-year'>Year*</label>
            <input id='vehicle-year' type="text" placeholder='Year' 
                value={year}
                onChange={(event) => setYear(event.target.value)}
            />
            <p id='vehicle-year-err' className='profile-error'></p>


            <label htmlFor='vehicle-color'>Color*</label>
            {/* colors yoinked from sbu parking site */}
            <select id="vehicle-color" name="vehicle-color" value={color} onChange={(event) => setColor(event.target.value)}>
                <option value="">&nbsp;</option>
                <option value="Black">Black</option>
                <option value="Blue">Blue</option>
                <option value="Brown">Brown</option>
                <option value="Gold">Gold</option>
                <option value="Gray">Gray</option>
                <option value="Green">Green</option>
                <option value="Maroon">Maroon</option>
                <option value="Orange">Orange</option>
                <option value="Pink">Pink</option>
                <option value="Purple">Purple</option>
                <option value="Red">Red</option>
                <option value="Silver">Silver</option>
                <option value="Tan">Tan</option>
                <option value="White">White</option>
                <option value="Yellow">Yellow</option>
                <option value="Other">Other</option>
            </select>
            <p id='vehicle-color-err' className='profile-error'></p>

            <p
                style={{margin: '0', fontSize: '13px', color: 'var(--gray)'}}
            >* fields are required</p>
            <input type="submit" className='profile-update-btn' value="Add Vehicle" />
        </form>
    </>);
}