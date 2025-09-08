import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router";
import { router } from './router/Router.jsx';
import AuthProvider from './constex/AuthProvider.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './pages/home/banner/NotificationProvider.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist max-w-7xl mx-auto'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>               {/* 🔥 প্রথমে AuthProvider */}
          <NotificationProvider>     {/* 🔥 তারপর NotificationProvider */}
            <RouterProvider router={router} />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
