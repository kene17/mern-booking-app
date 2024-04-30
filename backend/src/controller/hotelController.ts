import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import Hotel, { HotelType } from '../models/hotel';

const createHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //upload images to cloudinary
    const uploadPromises = imageFiles.map(async (image) => {
      //converts images to base64
      const b64 = Buffer.from(image.buffer).toString('base64');
      let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI);
      return res.url;
    });
    const imageUrls = await Promise.all(uploadPromises);

    //if the upload was successful, add the urls to the new hotel
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    //save new hotel to database
    const hotel = new Hotel(newHotel);
    await hotel.save();
    res.status(201).send(hotel);
  } catch (error) {
    console.log('error creating hotel: ', error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export default { createHotel };
