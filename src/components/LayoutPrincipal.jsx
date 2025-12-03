import { Outlet } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../context/ThemeContext';

const LayoutPrincipal = () => {
  return (
    <ThemeProvider>
      {/* Adicionado duration-500 e ease-in-out para suavizar a transição global de cores */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-500 ease-in-out">
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
        <main className="flex-grow container mx-auto px-4 py-8 transition-all duration-500">
          <Outlet />
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-8 text-center mt-auto transition-colors duration-500">
          <div className="container mx-auto">
            <p className="font-medium">© 2025 CookBook</p>
            <p className="text-sm mt-2">Desenvolvido por Guilherme Ventura - Projeto Final React</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default LayoutPrincipal;