import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

import { mailOptions } from '@/lib/mailOptions';
import sendMail from '@/lib/sendMail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, name, password, confirmPassword } = req.body;

    const existingUser = await prismadb.user.findFirst({
      where: {
        name,
      },
    });

    const existingEmail = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(422).json({ error: 'Username taken' });
    }

    if (!name.match(/^([a-zA-Z0-9][a-zA-Z]).{3,18}$/)) {
      return res.status(422).json({
        error:
          'Username must be between 5 and 20 characters long - only letters or mix of letters and numbers allowed',
      });
    }

    if (existingEmail) {
      return res.status(422).json({ error: 'Email taken' });
    }

    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      return res.status(422).json({ error: 'Email is not valid' });
    }

    if (
      !password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    ) {
      return res.status(422).json({
        error:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one symbol',
      });
    }

    if (confirmPassword !== password) {
      return res.status(422).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailToken: crypto.randomBytes(64).toString('hex'),
      },
    });

    sendMail(mailOptions(user.email, user.emailToken, user.name, req), res);

    return res.status(200).json({
      success:
        'An email verification link has been sent to your email address',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
