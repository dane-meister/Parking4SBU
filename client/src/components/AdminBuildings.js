import axios from "axios";
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

export default function AdminBuildings({
  buildings, setBuildings,
  setEditingBuilding,
  setAddingBuilding,
  isLoading,
}) {  
  const handleDeleteBuilding = async (bldg_id) => {
    if (!window.confirm("Are you sure you want to delete this lot?")) return;

    axios.delete(`${HOST}/api/admin/buildings/${bldg_id}/remove`, { withCredentials: true })
      .then(() => {
        setBuildings(prev => prev.filter(bldg => bldg.id !== bldg_id))
      })
      .catch((err) => {
        console.error(`Error deleting building: ${err}`);
        alert(`Error deleting building!`)
      });
  }

  return (<>
    <button className="add-lot-button" onClick={() => setAddingBuilding(true)}>Add a Building</button>
    <h2>Manage Buildings</h2>
    <div className="user-list">
      {isLoading ? (
        <p style={{ padding: '1em' }}>Loading buildings...</p>
      ) : (
      <>
      {buildings.length === 0 && <p>No buildings found.</p>}
      {buildings.toSorted((a, b) => a.id - b.id)
        .map(building => (
          <div className="user-card" key={building.id}>
          <div className="user-info">
            <strong style={{fontFamily: 'Barlow Bold, sans-serif'}}>{building.building_name}</strong><br />
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
      </>)}
    </div>
  </>);
}