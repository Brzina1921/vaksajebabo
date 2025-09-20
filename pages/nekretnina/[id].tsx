import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import Navbar from '@/components/Navbar';
import PropertyDetails from '@/components/PropertyDetails';

const Nekretnina = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [property, setProperty] = useState([] as any);
  const [user, setUser] = useState([] as any);

  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    const loadProperty = async () => {
      try {
        const res = await axios.post('/api/nekretninaFetch', {
          id,
        });
        if (res.status === 200) {
          setProperty(res.data.property);
          console.log(res.data.property);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (!property?.userId) {
      return;
    }
    const userDetails = async () => {
      try {
        const res = await axios.post('/api/fetchUser', {
          userId: property.userId,
        });
        if (res.status === 200) {
          setUser(res.data.user);
          console.log(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    userDetails();
  }, [property]);

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen h-full">
        {property.length !== 0 && (
          <PropertyDetails
            property={{
              title: property.title,
              price: property.price,
              images: property?.images || [],
              type: property.type,
              address: property.address,
              city: property.city,
              zip: property.zip,
              municipality: property.municipality,
              state: property.state,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              size: property.size,
              yearBuilt: property.yearBuilt,
              yard: property.yard,
              yardSize: property.yardSize,
              category: property.category,
              createdAt: property.createdAt,
              description: property.description,
              status: property.status,
              latLong: property.latLong,
              propertyId: property.id,
              amenities: property.amenities,
            }}
            user={{ username: user.name, id: user.id }}
            session={{ sessionId: session?.user?.id }}
          ></PropertyDetails>
        )}
      </div>
    </>
  );
};

export default Nekretnina;
