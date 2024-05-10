import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotel';
import { HotelType } from '../shared/types';

const createHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //upload images to cloudinary
    const imageUrls = await uploadImages(imageFiles);
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

const getCurrentUsersHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ messahe: 'Error fetching hotels' });
  }
};

const editHotel = async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels' });
  }
};

const updateHotel = async (req: Request, res: Response) => {
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId, userId: req.userId },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);
    //...(updatedHotel.imageUrls || []) because images can be deleted
    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    //converts images to base64
    const b64 = Buffer.from(image.buffer).toString('base64');
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default { createHotel, getCurrentUsersHotels, editHotel, updateHotel };
