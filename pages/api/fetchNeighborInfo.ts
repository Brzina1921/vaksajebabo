import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  interface Place {
    name: string;
    distance: number;
  }

  const { lat, lon } = req.body;

  const baseUrl = 'https://api.geoapify.com/v2/places';
  const params = {
    apiKey: process.env.GEOAPIFY_API_KEY,
    filter: `circle:${lon},${lat},1000`,
    bias: `proximity:${lon},${lat}`,
    limit: 20,
    categories:
      'commercial.supermarket,healthcare.pharmacy,building.healthcare,education.school',
  };

  try {
    const response = await axios.get(baseUrl, { params });

    const places = response.data.features.reduce(
      (acc: any, feature: any) => {
        const categories = feature.properties.categories;
        const place = {
          name: feature.properties.name,
          distance: feature.properties.distance || '',
        };

        if (categories.includes('commercial.supermarket')) {
          place.name !== undefined && acc.trgovine.push(place);
        }
        if (categories.includes('healthcare.pharmacy')) {
          place.name !== undefined && acc.apoteke.push(place);
        }
        if (categories.includes('building.healthcare')) {
          place.name !== undefined && acc.bolnice.push(place);
        }
        if (categories.includes('education.school')) {
          place.name !== undefined && acc.škole.push(place);
        }
        return acc;
      },
      {
        trgovine: [] as Place[],
        apoteke: [] as Place[],
        bolnice: [] as Place[],
        škole: [] as Place[],
      }
    );

    return res.status(200).json({ places });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
