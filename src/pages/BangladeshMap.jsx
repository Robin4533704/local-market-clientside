import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaSearch } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Map view changer component
const MapViewChanger = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

const BangladeshMap = ({ servicesData }) => {
  const defaultCenter = [23.685, 90.356]; // Bangladesh central point
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  // Update filtered districts based on search term
  useEffect(() => {
    const results = servicesData.filter(({ district }) =>
      district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDistricts(results);
  }, [searchTerm, servicesData]);

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setSearchTerm(district.district);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredDistricts.length === 1) {
      handleSelectDistrict(filteredDistricts[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search Box */}
      <div className="relative max-w-md mx-auto mb-4">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search district..."
            className="flex-grow px-4 py-2 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedDistrict(null);
            }}
            onKeyDown={handleKeyDown}
          />
          <button className="px-4 text-gray-600 hover:text-gray-900">
            <FaSearch size={18} />
          </button>
        </div>
        {/* Suggestions Dropdown */}
        {searchTerm && filteredDistricts.length > 0 && !selectedDistrict && (
          <ul className="absolute z-20 w-full bg-white border border-t-0 rounded-b-md max-h-48 overflow-y-auto shadow-lg">
            {filteredDistricts.slice(0, 5).map((dist) => (
              <li
                key={dist.district}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelectDistrict(dist)}
              >
                {dist.district}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={
          selectedDistrict
            ? [selectedDistrict.latitude, selectedDistrict.longitude]
            : defaultCenter
        }
        zoom={selectedDistrict ? 12 : 7}
        className="w-full h-[500px] rounded-xl shadow-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {servicesData.map(({ district, latitude, longitude, covered_area, status }) => (
          <Marker key={district} position={[latitude, longitude]}>
            <Popup>
              <strong>{district}</strong>
              <br />
              Area: {covered_area}
              <br />
              Status: {status}
            </Popup>
          </Marker>
        ))}

        {/* Map view update on district selection */}
        {selectedDistrict && (
          <MapViewChanger
            center={[selectedDistrict.latitude, selectedDistrict.longitude]}
            zoom={12}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;