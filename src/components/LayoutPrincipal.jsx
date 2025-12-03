import { Outlet } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';
import { Toaster } from 'react-hot-toast';

const LayoutPrincipal = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster 
        position="top-center"
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          pointerEvents: 'none',
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            style: {
              background: '#10B981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <BarraNavegacao />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 text-gray-500 py-8 text-center mt-auto">
        <div className="container mx-auto">
          <p className="font-medium">© 2025 CookBook</p>
          <p className="text-sm mt-2">Desenvolvido por Guilherme Ventura - Projeto Final React</p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutPrincipal;