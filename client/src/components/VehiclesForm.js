import React, { useEffect, useState } from 'react';
import { Popup } from '.';
import axios from 'axios';
const HOST = "http://localhost:8000"

export default function VehiclesForm({ userId, vehicles, currVehiclePage, setCurrVehiclePage, selectedVehicle, setSelectedVehicle }) {
  console.log(vehicles);
  const renderPage = (pageStr) => {
    switch(pageStr){
      case 'my_vehicles':
        return <MyVehicles
          userId={userId}
          vehicles={vehicles} 
          selectedVehicle={selectedVehicle}
          setCurrVehiclePage={setCurrVehiclePage}
          setSelectedVehicle={setSelectedVehicle}
        />;
      case 'add_vehicle':
        return <AddVehicle 
          userId={userId}
          setCurrVehiclePage={setCurrVehiclePage}
          setSelectedVehicle={setSelectedVehicle}
        />;
      case 'edit_vehicle':
        return <EditVehicle 
          vehicle={selectedVehicle}
          setCurrVehiclePage={setCurrVehiclePage}
          setSelectedVehicle={setSelectedVehicle}
        />;
    }
  }

  return (
    <section className="profile-form">
      {renderPage(currVehiclePage)}
    </section>
  );
}

function MyVehicles({ userId, vehicles, setCurrVehiclePage, setSelectedVehicle, selectedVehicle }){
  const [ popupVisible, setPopupVisible ] = useState(false);
  
  // TEMP override for testing frontend
  // vehicles = [
  //   { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'Green', isDefault: true},
  //   { make: 'Chevy', model: 'Colorado', year: '2021', plate: 'POO1111', color: 'Black' },
  //   { make: 'Jeep', model: 'Grand Cherokee', year: '1995', plate: 'KJY9586', color: 'Green' },
  //   { make: 'Chevy', model: 'Colorado', year: '2021', plate: 'POO1111', color: 'Black' },
  // ];

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
            <button className='vehicle-card-btn' id='vehicle-card-edit-btn' onClick={() => { setSelectedVehicle(vehicle); console.log("setting v to:", vehicle); setCurrVehiclePage('edit_vehicle'); }}>
              <img src='/images/edit-icon.png' alt='edit icon' />
              Edit
            </button>
            <button className='vehicle-card-btn' id='vehicle-card-delete-btn'
              onClick={() => {setSelectedVehicle(vehicle); setPopupVisible(true);}}
            >
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
      onClick={() => { setSelectedVehicle(null); setCurrVehiclePage('add_vehicle'); }}
    >+ Add Vehicle</button>
    {popupVisible &&
      <Popup name='profile' 
        closeFunction={() => { setSelectedVehicle(null); setPopupVisible(false); }} 
        popupHeading={'Are you sure you want to delete this car?:'}
      >
        <div style={{margin: '10px'}}>
          <div className="delete-car-card">
            <div className='vehicle-card-header'>
              <img src='/images/car.png' alt='car icon'/>
              <h3>{selectedVehicle.plate}</h3>
              {selectedVehicle.isDefault && <span className='vehicle-default-txt'>(default)</span>}
            </div>
            <div>{selectedVehicle.make} {selectedVehicle.model} </div>
            <div>{selectedVehicle.year}, {selectedVehicle.color}</div>
          </div>
        </div>
        <div className='profile-popup-btns' style={{display: 'flex', gap: '10px', margin: '0 10px'}}>
          <button 
            onClick={() => { setSelectedVehicle(null); setPopupVisible(false); }}
          >Cancel</button>
          <button id='car-delete-btn'>Delete</button>
        </div>
      </Popup>
    }
  </>);
}

function AddVehicle({ userId, setCurrVehiclePage, setSelectedVehicle }){
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
    
    axios.post(`${HOST}/api/auth/${userId}/add-vehicle`, {
      plate, model, make, year, color,
    }, { withCredentials: true })
      .then(() => {
        setSelectedVehicle(null);
        setCurrVehiclePage('my_vehicles');
      })
      .catch((err) => {
        console.error(err);
        setSelectedVehicle(null);
        setCurrVehiclePage('my_vehicles');
      })   
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
        <option value="">Select a Color</option>
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

function EditVehicle({ setCurrVehiclePage, vehicle, setSelectedVehicle }){
  const [ popupVisible, setPopupVisible ] = useState(false);
  const [ popupMsg, setPopupMsg ] = useState([]);

  const [ plate, setPlate ] = useState(vehicle.plate);
  const [ make, setMake ] = useState(vehicle.make);
  const [ model, setModel ] = useState(vehicle.model);
  const [ year, setYear ] = useState(vehicle.year);
  const [ color, setColor ] = useState(vehicle.color);

  function handleEditVehicleSubmit(event){
    event.preventDefault();
    const plateErr = document.getElementById('vehicle-plate-err');
    const makeErr = document.getElementById('vehicle-make-err');
    const modelErr = document.getElementById('vehicle-model-err');
    const yearErr = document.getElementById('vehicle-year-err');
    const colorErr = document.getElementById('vehicle-color-err');

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
    
    const hardcodedTuples = [
      [plate, vehicle.plate, 'Plate #'], [make, vehicle.make, 'Make'], [model, vehicle.model, 'Model'],
      [year, vehicle.year, 'Year'], [color, vehicle.color, 'Color']
    ];

    let differingFields = [];
    hardcodedTuples.map(tuple => {
      if(tuple[0] !== tuple[1]){
        differingFields.push([tuple[2], tuple[0]]);
      }
    });
    
    if(differingFields.length === 0){
      alert('No changes to update!');
      return;
    }

    setPopupMsg(differingFields);
    setPopupVisible(true);
  }

  const handleFieldChange = (current, original, inputId, labelId) => {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if(current === original){
      input.classList.remove('profile-modified');
      label.classList.remove('profile-modified');
    }else{
      input.classList.add('profile-modified');
      label.classList.add('profile-modified');
    }
  }
  
  return (<>
    <div className='vehicle-top-row'>
      <h2>Edit Vehicle</h2>
      <img 
        src='/images/x.png' 
        onClick={() => { setSelectedVehicle(null); setCurrVehiclePage('my_vehicles'); }}
        alt='close'
      />
    </div>
    <form onSubmit={handleEditVehicleSubmit}>
      <label htmlFor='vehicle-plate' id='vehicle-plate-lbl'>Plate #</label>
      <input id='vehicle-plate' type="text" placeholder='Plate Number' 
        value={plate}
        onChange={(e) => { setPlate(e.target.value); handleFieldChange(e.target.value, vehicle.plate, 'vehicle-plate', 'vehicle-plate-lbl'); }}
      />
      <p id='vehicle-plate-err' className='profile-error'></p>

      <label htmlFor='vehicle-make' id='vehicle-make-lbl'>Make</label>
      <input id='vehicle-make' type="text" placeholder='Make' 
        value={make}
        onChange={(e) => { setMake(e.target.value); handleFieldChange(e.target.value, vehicle.make, 'vehicle-make', 'vehicle-make-lbl'); }}
      />
      <p id='vehicle-make-err' className='profile-error'></p>

      <label htmlFor='vehicle-model' id='vehicle-model-lbl'>Model</label>
      <input id='vehicle-model' type="text" placeholder='Model' 
        value={model}
        onChange={(e) => { setModel(e.target.value); handleFieldChange(e.target.value, vehicle.model, 'vehicle-model', 'vehicle-model-lbl'); }}
      />
      <p id='vehicle-model-err' className='profile-error'></p>

      <label htmlFor='vehicle-year' id='vehicle-year-lbl'>Year</label>
      <input id='vehicle-year' type="text" placeholder='Year' 
        value={year}
        onChange={(e) => { setYear(e.target.value); handleFieldChange(e.target.value, vehicle.year, 'vehicle-year', 'vehicle-year-lbl'); }}
      />
      <p id='vehicle-year-err' className='profile-error'></p>


      <label htmlFor='vehicle-color' id='vehicle-color-lbl'>Color</label>
      {/* colors yoinked from sbu parking site */}
      {console.log("color:",vehicle.color)}
      <select id="vehicle-color" name="vehicle-color" value={color} 
        onChange={(e) => { setColor(e.target.value); handleFieldChange(e.target.value, vehicle.color, 'vehicle-color', 'vehicle-color-lbl'); }}
      >
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
      >* edited fields</p>
      <input type="submit" className='profile-update-btn' value="Edit Vehicle" />
    </form>

    {popupVisible &&
      <Popup name='profile' 
        closeFunction={() => { setSelectedVehicle(null); setCurrVehiclePage('my_vehicles'); setPopupVisible(false); }} 
        popupHeading={'Are you sure you want to edit the following fields?:'}
      >
        <div style={{margin: '10px'}}>
          {popupMsg.map((tuple, index) => {
            return <div key={index}>
              <strong>{tuple[0]}</strong>: {tuple[1]}
            </div>})}
        </div>
        <div className='profile-popup-btns' style={{display: 'flex', gap: '10px', margin: '0 10px'}}>
          <button 
            onClick={() => { setSelectedVehicle(null); setCurrVehiclePage('my_vehicles'); setPopupVisible(false); }}>Cancel</button>
          <button>Confirm Edits</button>
        </div>
      </Popup>
    }
  </>);
}