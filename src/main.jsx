import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router";
import { router } from './router/Router.jsx';
import AuthProvider from './constex/AuthProvider.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './pages/home/banner/NotificationProvider.jsx';
import { ProductProvider } from './pages/dashbord/paymentmethod/productContext/ProductContext.jsx';
// ✅ import ProductProvider

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist max-w-7xl mx-auto'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>               
          <NotificationProvider>     
            <ProductProvider>        {/* 🔥 ProductProvider wrap করা হল */}
              <RouterProvider router={router} />
            </ProductProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
