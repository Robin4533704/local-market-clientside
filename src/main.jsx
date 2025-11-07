import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router";
import { router } from './router/Router.jsx';
import AuthProvider from './constex/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductProvider } from './pages/dashbord/paymentmethod/productContext/ProductContext.jsx';
import { ToastContainer } from 'react-toastify';
// ✅ import ProductProvider

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist '>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>               
              
            <ProductProvider>        {/* 🔥 ProductProvider wrap করা হল */}
              <RouterProvider router={router} />
            </ProductProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
