import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prismadb from '@/lib/prismadb';

import sendMail from '@/lib/sendMail';
import { resetOptions } from '@/lib/mailOptions';

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

    if (user.emailVerified === null) {
      return res.status(422).json({ error: 'Email is not verified' });
    }

    const passwordToken = crypto.randomBytes(64).toString('hex');
    const hashedPasswordToken = await bcrypt.hash(passwordToken, 12);

    if (user) {
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordToken: hashedPasswordToken,
          passwordTokenExpiry: new Date(+new Date() + 60000 * 20),
        },
      });
    }

    sendMail(resetOptions(user.email, user.id, passwordToken, user.name, req), res);

    return res.status(200).json({
      success:
        'An email including a temporary link to reset your password has been sent to your email address',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
