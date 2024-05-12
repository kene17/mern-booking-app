import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';
import { useQuery } from 'react-query';
import * as apiClient from '../api/apiClient';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || '';

type ToastMessage = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};
//whenever the app loads up for the first time the context would always be undefined
const AppContext = createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError } = useQuery('validateToken', apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(undefined)}
          type={toast.type}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
