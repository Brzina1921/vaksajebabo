import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { userId } = req.body;

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  });
  return res.status(200).json({user: user})
};
