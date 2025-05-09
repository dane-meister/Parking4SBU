import React from 'react';

export default function AdminLots({
  lots,
  setEditingLot,
  handleDeleteLot,
  setAddLotForm
}) {

  lots = lots.toSorted((lot1, lot2) => lot1.id - lot2.id);
  return (
    <>
      <button className="add-lot-button" onClick={() => setAddLotForm(true)}>Add a Lot</button>
      <h2>Manage Parking Lots</h2>
      <div className="user-list">
        {lots.length === 0 ? (
          <p>No parking lots found.</p>
        ) : (
          lots.map(lot => (
            <div className="user-card" key={lot.id}>
              <div className="user-info">
                <strong>{lot.name}</strong><br />
                ID: {lot.id}<br />
                Location: {Array.isArray(lot.location?.coordinates)
                  ? lot.location.coordinates.map(
                    (coord, index) => `(${coord[1]}, ${coord[0]})`
                  ).join(', ')
                  : 'N/A'}<br />
              </div>
              <div className="user-actions">
                <img
                  src="/images/edit-icon1.png"
                  alt="Edit Lot"
                  className="icon"
                  onClick={() => setEditingLot({ ...lot })}
                />
                <img
                  src="/images/x.png"
                  alt="Delete Lot"
                  className="icon"
                  onClick={() => handleDeleteLot(lot.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
