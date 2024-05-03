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
    const starRating = Number(req.body.starRating);

    if (isNaN(starRating) || starRating < 1 || starRating > 5) {
      return res.status(400).json({
        message: 'Invalid star rating. Must be a number between 1 and 5.',
      });
    }

    //if the upload was successful, add the urls to the new hotel
    newHotel.imageUrls = imageUrls;
    newHotel.starRating = starRating;
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

const getAllUserHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ messahe: 'Error fetching hotels' });
  }
};

export default { createHotel, getAllUserHotels };
