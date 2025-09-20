import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { id } = req.body;

    const property = await prismadb.property.findUnique({
      where: {
        id: id,
      },
    });

    if (!property) {
      return res.status(404).end();
    }

    return res.status(200).json({ property: property });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
