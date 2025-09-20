import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import bcrypt, { compare } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { id, token, password, confirmPassword } = req.body;
    let isCorrectToken = false;

    const user = await prismadb.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user?.passwordToken) {
      isCorrectToken = await compare(token, user?.passwordToken);
    }

    if (!isCorrectToken) {
      return res.status(422).json({
        invalid: 'Invalid password reset link. Try to request a new one.',
      });
    }

    if (user?.passwordTokenExpiry && user?.passwordTokenExpiry < new Date()) {
      return res
        .status(422)
        .json({ invalid: 'Link has expired. Try to request a new one.' });
    }

    if (
      !password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    ) {
      return res.status(422).json({
        errorForm:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one symbol',
      });
    }

    if (confirmPassword !== password) {
      return res.status(422).json({ errorForm: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (user) {
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordToken: null,
          passwordTokenExpiry: null,
          hashedPassword: hashedPassword,
        },
      });
    }

    return res.status(200).json({ success: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
