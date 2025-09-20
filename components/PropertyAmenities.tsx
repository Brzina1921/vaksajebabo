import React from 'react';

import {
  FaSwimmer,
  FaDumbbell,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaDog,
  FaBuilding,
  FaLeaf,
  FaShieldAlt,
  FaArchway,
  FaFireAlt,
} from 'react-icons/fa';
import { GiBarbecue } from 'react-icons/gi';

interface PropertyAmenitiesProps {
  amenities: any;
}

interface Amenity {
  name: string;
  icon: React.ReactNode;
}

const amenitiesList: Amenity[] = [
  { name: 'Bazen', icon: <FaSwimmer /> },
  { name: 'Teretana', icon: <FaDumbbell /> },
  { name: 'Parking', icon: <FaCar /> },
  { name: 'WiFi', icon: <FaWifi /> },
  { name: 'Klima Uređaj', icon: <FaSnowflake /> },
  { name: 'Pet Friendly', icon: <FaDog /> },
  { name: 'Roštilj', icon: <GiBarbecue /> },
  { name: 'Lift', icon: <FaBuilding /> },
  { name: 'Bašta', icon: <FaLeaf /> },
  { name: 'Video Nadzor', icon: <FaShieldAlt /> },
  { name: 'Balkon', icon: <FaArchway /> },
  { name: 'Grijanje', icon: <FaFireAlt /> },
];

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-2">
      {amenities.map((amenityName: any) => {
        const amenity = amenitiesList.find((a) => a.name === amenityName);
        return (
          amenity && (
            <div
              key={amenity.name}
              className="flex items-start space-x-2 p-2 border rounded-lg shadow-lg bg-white"
            >
              <span className="text-2xl text-blue-500">{amenity.icon}</span>
              <span className="text-sm sm:text-base">{amenity.name}</span>
            </div>
          )
        );
      })}
    </div>
  );
};

export default PropertyAmenities;
