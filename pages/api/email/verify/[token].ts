import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const token = req.body.token;

    const user = await prismadb.user.findUnique({
      where: {
        emailToken: token?.toString(),
      },
    });

    if (user?.emailVerified !== null) {
      return res
        .status(422)
        .json({ error: 'Email is already verified or link is invalid' });
    }

    if (user) {
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailToken: null,
          emailVerified: new Date(),
        },
      });
    }

    return res.status(200).json({ success: 'Email verified successfully'});
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
