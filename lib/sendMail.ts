import { NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendMail = (mailOptions: any, res: NextApiResponse) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_GMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_GMAIL_USER,
      pass: process.env.SMTP_GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200);
    }
  });
};

export default sendMail;
