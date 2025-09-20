import { useEffect } from 'react';

import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import { Icon } from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import L from 'leaflet';

interface MapProps {
  position: any;
}

const Map: React.FC<MapProps> = ({ position }) => {
  const ICON = new Icon({
    iconUrl: '../images/marker.png',
    iconSize: [32, 32],
  });


  return (
    <>
      <MapContainer
        className="z-0"
        center={position}
        zoom={18}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '50vh' }}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={ICON}></Marker>
      </MapContainer>
    </>
  );
};

export default Map;
