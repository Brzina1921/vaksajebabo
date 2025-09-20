import React from 'react';

interface Amenity {
  name: string;
  icon: React.ReactNode;
}

interface AmenitySelectorProps {
  selectedAmenities: string[];
  toggleAmenity: (name: string) => void;
  amenities: Amenity[];
}

const AmenitySelector: React.FC<AmenitySelectorProps> = ({
  selectedAmenities,
  toggleAmenity,
  amenities,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {amenities.map((amenity) => (
        <div
          key={amenity.name}
          className={`p-4 border rounded cursor-pointer flex items-center justify-center space-x-2 ${
            selectedAmenities.includes(amenity.name)
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black'
          }`}
          onClick={() => toggleAmenity(amenity.name)}
        >
          <span className="text-2xl">{amenity.icon}</span>
          <span>{amenity.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AmenitySelector;
