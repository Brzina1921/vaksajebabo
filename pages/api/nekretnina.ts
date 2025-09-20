import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import prismadb from '@/lib/prismadb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET,
  });

  const uploadToCloudinary = async (localFilePath: any, folder: any) => {
    return cloudinary.v2.uploader
      .upload(localFilePath, {
        upload_preset: 'real_estate_app',
        folder: folder,
      })
      .then((result) => {
        return result.url;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // parse form with a Promise wrapper
  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  try {
    var imageUrlList: any = [];
    // const form = new IncomingForm();
    // form.parse(req, async (err, fields: any, files: any) => {
    // console.log(fields);
    // console.log("files form", files);

    // if (data.fields.title === '') {
    //   return res.status(400).send({ error: 'Title is required ' });
    // }

    // if (fields.address === '') {
    //   return res.status(400).send({ error: 'Address is required ' });
    // }

    // if (files.length === 0) {
    //   return res.status(400).send({ error: 'Images are required' });
    // }

    const property = await prismadb.property.create({
      data: {
        title: data.fields.title as string,
        address: data.fields.address as string,
        city: data.fields.city as string,
        zip: data.fields.zip as string,
        state: data.fields.state as string,
        size: parseInt(data.fields.size) as number,
        bedrooms: parseInt(data.fields.bedrooms) as number,
        bathrooms: parseInt(data.fields.bathrooms) as number,
        price: data.fields.price as string,
        category: data.fields.category as string,
        type: data.fields.type as string,
        description: data.fields.description as string,
        yearBuilt: parseInt(data.fields.yearBuilt) as number,
        yard: data.fields.lot as string,
        yardSize: parseInt(data.fields.lotArea) as number,
        substitution: data.fields.zamjena as string,
        municipality: data.fields.municipality as string,
        userId: data.fields.userId as string,
        latLong: [parseFloat(data.fields.lat), parseFloat(data.fields.long)],
        amenities: JSON.parse(data.fields.amenities),
      },
    });

    const length = data.fields.length;
    for (let i = 0; i <= length; i++) {
      var localFilePath = data.files['images[' + i + ']'].filepath;
      var result = await uploadToCloudinary(localFilePath, property.id);
      imageUrlList.push(result);
    }
    await prismadb.property.update({
      where: {
        id: property.id,
      },
      data: {
        images: {
          push: imageUrlList.map((image: any) => image),
        },
      },
    });
    return res.status(200).json({ property: property });
  } catch (error) {
    console.log(error);
  }
};
