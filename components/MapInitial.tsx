import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const ICON = new Icon({
  iconUrl: '../images/marker.png',
  iconSize: [32, 32],
});

const LocationMarker = ({ pos, onMove }: any) => {
  const map = useMap();
  return (
    <Marker
      icon={ICON}
      position={pos}
      draggable
      autoPan
      eventHandlers={{
        moveend: (event) => {
          onMove([event.target.getLatLng().lat, event.target.getLatLng().lng]);
          map.setView([
            event.target.getLatLng().lat,
            event.target.getLatLng().lng,
          ]);
        },
        add: (event) => {
          map.setView([
            event.target.getLatLng().lat,
            event.target.getLatLng().lng,
          ]);
        },
        click: (event) => {
          map.setView(
            [event.target.getLatLng().lat, event.target.getLatLng().lng],
            18
          );
        },
      }}
    />
  );
};

interface MapInitialProps {
  position: any;
  setFinalPosition(pos: any): any;
}

const MapInitial: React.FC<MapInitialProps> = ({ position, setFinalPosition }) => {
  const [markerPos, setMarkerPos] = useState(position);

  const RecenterAutomatically = ({ latLon }: any) => {
    const map = useMap();
    useEffect(() => {
      map.setView(latLon);
    }, [latLon]);
    return null;
  };

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  useEffect(() => {
    setFinalPosition(markerPos)
  }, [markerPos])

  return (
    <>
      <MapContainer
        center={markerPos}
        zoom={18}
        maxZoom={18}
        style={{ width: '100%', height: '50vh' }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onMove={setMarkerPos} pos={markerPos} />
        <RecenterAutomatically latLon={markerPos} />
      </MapContainer>
      <div>
        {markerPos[0]} {markerPos[1]}
      </div>
    </>
  );
};

export default MapInitial;
