export default function Buildings({
  buildings,
  setEditingBuilding,
  setAddingBuilding,
  handleDeleteBuilding,
  refreshBuildings
}) {  

  return (<>
    <button className="add-lot-button" onClick={() => setAddingBuilding(true)}>Add a Building</button>
    <h2>Manage Buildings</h2>
    <div className="user-list">
      {buildings.length === 0 && <p>No buildings found.</p>}
      {buildings.toSorted((a, b) => a.id - b.id)
        .map(building => (
          <div className="user-card" key={building.id}>
          <div className="user-info">
            <strong>{building.building_name}</strong><br />
            ID: {building.id}<br />
            Location: {Array.isArray(building.location?.coordinates)
              ? building.location.coordinates.map(
                (coord, index) => `(${coord[1]}, ${coord[0]})`
              ).join(', ')
              : 'N/A'}<br />
          </div>
          <div className="user-actions">
            <img
              src="/images/edit-icon1.png"
              alt="Edit Lot"
              className="icon"
              onClick={() => setEditingBuilding({ ...building })}
            />
            <img
              src="/images/x.png"
              alt="Delete Lot"
              className="icon"
              onClick={() => handleDeleteBuilding(building.id)}
            />
          </div>
        </div>
        ))
      }
    </div>
  </>);
}