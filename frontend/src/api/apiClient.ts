import { RegisterFormData } from '../pages/Register';
import { SignInFormData } from '../pages/SignIn';
import { HotelType } from '../../../backend/src/shared/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    credentials: 'include', //tells the browser to set the cookie
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    credentials: 'include', //tells the browser to set the cookie
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: 'include', //tells the browser to set the cookie
  });

  if (!response.ok) throw new Error('Token Invalid');

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
    credentials: 'include', //tells the browser to set the cookie
    method: 'POST',
  });

  if (!response.ok) throw new Error('Error during sign out');

  return response.json();
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: 'include', //tells the browser to set the cookie
    method: 'POST',
    body: hotelFormData,
  });

  if (!response.ok) throw new Error('Failed to add hotel');

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: 'include', //tells the browser to set the cookie
    method: 'GET',
  });

  if (!response.ok) throw new Error('Failed to fetch hotels');

  return response.json();
};
