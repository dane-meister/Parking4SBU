import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'

import { Sidebar, Map } from '../components';

const LotSelection = ({ selectedLot, setSelectedLot }) => {
  return (
    <div className="main-container">
        {/* Left: Map container */}
        <div className="map-container">
          <Map />
        </div>

        {/* Right: Results & selections container */}
        <div className="results-container">
          <Sidebar selectedLot={selectedLot} setSelectedLot={setSelectedLot} />
        </div>
    </div>
  )
}

export default LotSelection;