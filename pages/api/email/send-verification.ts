import { mailOptions } from '@/lib/mailOptions';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

import sendMail from '@/lib/sendMail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const email = req.body.email;

    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(422).json({ error: 'User not found' });
    }

    if (user.emailToken === null) {
      return res.status(422).json({ error: 'Email address already verified' });
    }

    sendMail(mailOptions(user.email, user.emailToken, user.name, req), res);

    res.status(200).json({
      success: 'An email verification link has been sent to your email address',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
