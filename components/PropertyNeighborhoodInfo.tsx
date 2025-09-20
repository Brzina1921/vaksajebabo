import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaStore,
  FaCoffee,
  FaBus,
  FaHospital,
  FaSchool,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

interface PropertyNeighborhoodInfoProps {
  lat: number;
  lon: number;
}

interface Place {
  name: string;
  distance: number;
}

interface NearbyPlaces {
  trgovine: Place[];
  apoteke: Place[];
  bolnice: Place[];
  škole: Place[];
}

const PropertyNeighborhoodInfo: React.FC<PropertyNeighborhoodInfoProps> = ({
  lat,
  lon,
}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaces>({
    trgovine: [],
    apoteke: [],
    bolnice: [],
    škole: [],
  });

  const [expandedCategory, setExpandedCategory] = useState<
    keyof NearbyPlaces | null
  >(null);

  const fetchPlaces = async () => {
    try {
      const res = await axios.post('/api/fetchNeighborInfo', {
        lat,
        lon,
      });
      if (res.status === 200) {
        setNearbyPlaces(res.data.places);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    fetchPlaces();
  }, [lat, lon]);

  const toggleExpand = (category: keyof NearbyPlaces) => {
    setExpandedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const categoryIcons: { [key: string]: JSX.Element } = {
    trgovine: <FaStore className="text-blue-500" />,
    apoteke: <FaCoffee className="text-yellow-500" />,
    bolnice: <FaHospital className="text-red-500" />,
    škole: <FaSchool className="text-green-500" />,
  };

  return (
    <div className="p-4 lg:p-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 font-black tracking-tight text-gray-900 text-xl">
        POI tačke u blizini
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(
          ['trgovine', 'apoteke', 'bolnice', 'škole'] as (keyof NearbyPlaces)[]
        ).map((category) => (
          <div
            key={category}
            className="mb-6 cursor-pointer md:pointer-events-none"
            onClick={() => toggleExpand(category)}
          >
            <div className="flex items-center justify-between md:justify-start mb-4">
              <div className="flex items-center flex-grow">
                <div className="mr-3">{categoryIcons[category]}</div>
                <h4 className="text-xl font-semibold text-gray-700">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
              </div>
              <div className="md:hidden">
                {expandedCategory === category ? <FaMinus /> : <FaPlus />}
              </div>
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                expandedCategory === category ? 'max-h-screen' : 'max-h-0'
              } md:max-h-screen`}
            >
              <ul className="space-y-2">
                {nearbyPlaces[category].length !== 0 ? (
                  nearbyPlaces[category]
                    .slice(0, 3)
                    .map((place: any, index: any) => (
                      <li
                        key={index}
                        className="flex p-3 items-start bg-white border rounded-lg shadow-md"
                      >
                        <div className="flex-grow">
                          <span className="font-medium text-gray-800">
                            {place.name}
                          </span>

                          <span className="text-sm text-gray-500 ml-1">
                            - {place.distance} metara
                          </span>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
                    <div className="flex-grow">
                      <span className="font-medium text-gray-800">
                        Nema u blizini
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyNeighborhoodInfo;
