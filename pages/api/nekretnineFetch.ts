import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { type, category, propertyId, city, id } = req.body;

    const property = await prismadb.property.findMany({
      where: {
        type: type,
        id: { not: propertyId },
        city: city,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const userProperties = await prismadb.property.findMany({
      where: {
        userId: id,
        id: { not: propertyId },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!property) {
      return res.status(404).end();
    }

    return res.status(200).json({ property, userProperties });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
