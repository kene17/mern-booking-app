import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getUserById = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    //get user and remove password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};
const createNewUser = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: 'User already exists!' });
    }
    user = new User(req.body);

    await user.save();
    //store userId in the token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '1d',
      }
    );
    //were setting the token, so we dont need to send anything to the frontend
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).send({ message: 'User registeratioin successful!' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '1d',
      }
    );
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ userId: user._id }); //user._id from the db
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const logout = async (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

const verifyToken = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
};

export default { createNewUser, loginUser, verifyToken, logout, getUserById };
